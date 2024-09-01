import type { Ref, UnwrapRef, Reactive } from "vue";
import consola from "consola";
import { flattenObject, unflattenObject } from "./utils";

/**
 * A utility function that persists a Vue `Ref` or `Reactive` object in the URL query parameters.
 * The function will automatically update the query parameters when the value of the `Ref` or `Reactive` changes,
 * and will update the `Ref` or `Reactive` object with values from the query parameters if they exist on initial load.
 *
 * @template T - The type of the item, which can be either a `Ref` or a `Reactive` object.
 * 
 * @param {T} item - The Vue `Ref` or `Reactive` object that should be persisted in the URL query parameters.
 * @param {string} [key] - The key under which the value should be stored in the query parameters. 
 *                         This parameter is required if the item is a `Ref`. If the item is a `Reactive` object, 
 *                         it should not be provided, and the object's keys will be used as query parameter keys.
 * 
 * @returns {T} - Returns the original `Ref` or `Reactive` object after applying the persistence logic.
 * 
 * @throws {Warning} - Throws a warning if a `Ref` is provided without a `key`, or if an unsupported type is provided.
 * 
 * @example
 * // Using with a Ref
 * const count = ref(0);
 * usePersistence(count, "count"); // The value of count will be synced with the "count" query parameter.
 *
 * @example
 * // Using with a Reactive object
 * const state = reactive({ name: 'John', age: 30 });
 * usePersistence(state); // The values of state will be synced with the corresponding query parameters.
 */

function usePersistence<T extends Ref<any> | Reactive<any>>(item: T, key?: string): T {
  const router = useRouter();
  const route = useRoute();

  let itemType: Ref<'ref' | 'reactive' | undefined> = ref(undefined);

  if (isRef(item)) {
    itemType.value = 'ref';

    if (route.query[key || 'test']) {
      item.value = route.query[key || 'test'] as UnwrapRef<T>;
    }

    watch(item, () => {
      const newQ = {
        ...route.query,
        [key || 'test']: JSON.parse(JSON.stringify(item.value))
      };

      router.push({ query: newQ });
    }, { deep: true });
  }

  if (isReactive(item)) {
    itemType.value = 'reactive';

    const lastValue = ref(flattenObject(item as Reactive<Record<string, any>>));

    const initialValues = flattenObject(route.query);
    for (const k in initialValues) {
      if (k in lastValue.value) {
        lastValue.value[k] = initialValues[k];
      }
    }

    Object.assign(item as Reactive<Record<string, any>>, unflattenObject(lastValue.value));

    watch(
      item as Reactive<Record<string, any>>,
      (newValue: Record<string, any>) => {
        const flatNewValue = flattenObject(newValue);
        const changes: Record<string, any> = {};

        for (const key in flatNewValue) {
          if (flatNewValue[key] !== lastValue.value[key]) {
            changes[key] = flatNewValue[key];
          }
        }

        if (Object.keys(changes).length === 0) {
          return;
        }

        lastValue.value = { ...flatNewValue };

        const newQ = {
          ...route.query,
          ...changes
        };

        router.push({ query: newQ });
      },
      { deep: true }
    );
  }

  if (itemType.value === undefined) {
    consola.warn('usePersistence expects a Ref or Reactive as first parameter');
  }

  return item;
}

export default usePersistence;
