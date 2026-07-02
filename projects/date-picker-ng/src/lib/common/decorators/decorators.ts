import { UtilsService } from '../services/utils/utils.service';

export const DEFAULT_DEBOUNCE_MS = 500;

interface DebounceResult {
  configurable: boolean;
  enumerable: false | true | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(): any;
}

type DebounceFunction = (_target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => DebounceResult;

export function debounce(ms: number = DEFAULT_DEBOUNCE_MS): DebounceFunction {
  return function (_target: unknown, propertyKey: string, descriptor: PropertyDescriptor): DebounceResult {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get(): any {
        Object.defineProperty(this, propertyKey, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: UtilsService.debounce(descriptor.value as (arg: unknown) => void, ms),
        });

        return this[propertyKey];
      },
    };
  };
}
