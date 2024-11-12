import type { Ref, UnwrapRef, Reactive } from "vue";
import consola from "consola";
import { flattenObject, unflattenObject } from "./utils";
import { isRef, isReactive, ref, watch, useRouter, useRoute } from "#imports";

function usePersistence<T extends Ref<any> | Reactive<any>>(item: T, key?: string): T {
  const router = useRouter();
  const route = useRoute();

  let itemType: Ref<'ref' | 'reactive' | undefined> = ref(undefined);

  if (isRef(item)) {
    itemType.value = 'ref';

    if (!key) {
      consola.warn('usePersistence expects a key as second parameter when using with a Ref');
      return item;
    }

    // Initialisation depuis l'URL en traitant le JSON encodé
    if (route.query[key]) {
      try {
        item.value = JSON.parse(route.query[key] as string);
      } catch (error) {
        consola.warn(`Failed to parse query parameter for ${key}:`, error);
      }
    }

    // Watch pour détecter les changements dans le ref
    watch(
      item,
      () => {
        const newQ = {
          ...route.query,
          [key]: JSON.stringify(item.value), // Encode l'ensemble du tableau en JSON
        };

        router.push({ query: newQ });
      },
      { deep: true }
    );
  }

  if (isReactive(item)) {
    itemType.value = 'reactive';

    const lastValue = ref(flattenObject(item as Reactive<Record<string, any>>));

    const initialValues = flattenObject(route.query);
    for (const k in initialValues) {
      if (k in lastValue.value) {
        try {
          lastValue.value[k] = JSON.parse(initialValues[k] as string);
        } catch (error) {
          consola.warn(`Failed to parse query parameter for ${k}:`, error);
        }
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
            changes[key] = JSON.stringify(flatNewValue[key]);
          }
        }

        if (Object.keys(changes).length === 0) {
          return;
        }

        lastValue.value = { ...flatNewValue };

        const newQ = {
          ...route.query,
          ...changes,
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
