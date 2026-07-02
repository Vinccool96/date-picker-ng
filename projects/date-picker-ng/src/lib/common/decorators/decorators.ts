import { UtilsService } from '../services/utils/utils.service';

export const DEFAULT_DEBOUNCE_MS = 500;

export function debounce(ms: number = DEFAULT_DEBOUNCE_MS) {
  return function (_target, propertyKey: string, descriptor: PropertyDescriptor) {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get() {
        Object.defineProperty(this, propertyKey, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: UtilsService.debounce(descriptor.value as (arg: unknown) => void, ms),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this[propertyKey];
      },
    };
  };
}
