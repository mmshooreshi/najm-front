// composables/useNavDirection.ts
export const useNavDirection = () =>
    useState<'forward' | 'back'>('navDirection', () => 'forward')
  