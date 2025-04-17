export const useNavDirection = () =>
    useState<'forward' | 'back'>('navDirection', () => 'back')
  