# BreakUp Frontend

Une application mobile React Native/Expo pour accompagner les personnes traversant une rupture amoureuse.

## 🎨 Design & Thème

L'app utilise une palette de couleurs apaisante et minimaliste :
- **Rose** (Souvenirs) : `#ff7070` - Suppression assistée des souvenirs
- **Lavender** (Chat) : `#7a3cd9` - Discussion & soutien communautaire
- **Sky** (Blog) : `#0ea5e9` - Articles psychologiques
- **Sage** (Journal) : `#3a6539` - Carnet de route personnel

Animations lentes, UI chaleureuse, expérience de sécurité et réconfort.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`

### Installation

```bash
cd frontend
npm install
```

### Développement

```bash
# Démarrer le serveur dev avec dev-client
expo start --dev-client --platform ios

# Ou utiliser le launch.json configuré
npm run dev  # (si disponible)
```

Le serveur backend doit tourner sur `http://localhost:3333` (voir [Backend README](../backend/README.md)).

## 📦 Structure du projet

```
frontend/
├── src/
│   ├── components/        # Composants réutilisables (UI, forms)
│   ├── screens/          # Écrans (Home, Journal, Blog, Chat, Memories)
│   ├── navigation/       # React Navigation stacks & types
│   ├── hooks/            # Hooks custom (useAuth, useJournal, etc.)
│   ├── stores/           # Zustand stores (app state, auth, etc.)
│   ├── services/         # API calls, face detection, etc.
│   ├── types/            # TypeScript types & interfaces
│   ├── utils/            # Helper functions (date formatting, etc.)
│   └── theme/            # Design tokens (colors, typography)
├── App.tsx               # Entry point
├── tailwind.config.js    # NativeWind config (Tailwind for RN)
└── package.json
```

## 🔧 Stack technique

- **React Native** + **Expo** (dev-client) - Framework mobile
- **TypeScript** - Type safety
- **Zustand** - State management (persistent + ephemeral stores)
- **TanStack Query (React Query)** - Server state & caching
- **React Navigation** - Navigation entre écrans
- **NativeWind** - Tailwind CSS pour React Native
- **Feather Icons** - Icons library

## 📱 Fonctionnalités principales

### 1. Suppression assistée des souvenirs (Memories)
- Identification de photos/contenus liés à l'ex via face detection
- Suppression progressive : masquer → archiver → supprimer
- Suivi de progression
- Messages de soutien

### 2. Chat communautaire (Chat)
- Salons par thème + 1-to-1
- Mode anonyme optionnel
- Modération bienveillante

### 3. Blog psychologique (Blog)
- Articles par catégories (relations toxiques, deuil, confiance, reconstruction)
- Système de favoris
- Lecture simple, design apaisant

### 4. Journal personnel (Journal)
- Wizard 3 étapes : émotion → prompt → contenu
- Une entrée par jour
- Questions prédéfinies adaptées au temps écoulé depuis la rupture
- Suivi de l'évolution émotionnelle
- Messages positifs & relecture du parcours

### 5. Accueil (Home)
- Grille 2×2 des 4 sections principales
- Citation inspirante du jour (1ère connexion quotidienne)
- Bienvenue personnalisée

## 🔑 Variables d'environnement

Créer un fichier `.env.local` à la racine du frontend :

```
EXPO_PUBLIC_API_URL=http://[YOUR_MACHINE_IP]:3333
```

Remplacer `[YOUR_MACHINE_IP]` par l'IP locale de ta machine (ex: `10.71.135.213`).

## 🎯 Stores (Zustand)

### `useAuthStore`
Authentification, tokens, infos utilisateur

### `useMemoryStore`
État du cleanup de photos, configuration des sources

### `useOnboardingStore`
Réponses du questionnaire onboarding (firstName, lastAction, breakupDate, etc.)

### `useJournalComposeStore`
État temporaire du wizard journal (emotion, prompt, content) — réinitialisé après soumission

### `useChatStore`
Mode anonyme, salons rejoints

### `useAppStore`
État global (lastQuoteDate pour la citation quotidienne)

## 🎨 Styling avec NativeWind

NativeWind traduit les classes Tailwind en StyleSheet React Native :

```tsx
<View className="bg-rose-50 rounded-card border border-rose-100 p-4">
  <Text className="text-rose-400 font-semibold">Titre</Text>
</View>
```

**Important** : Les classes dynamiques via template literals ne sont pas détectées par Tailwind. Solution :
- Ajouter à `tailwind.config.js` safelist
- Ou passer les couleurs via `style={{ color: colors.rose[400] }}`

## 🔐 Authentification

Flows implémentés :
- Registration / Login via email + password
- Password reset (email avec code de réinitialisation)
- JWT tokens (access + refresh)
- Onboarding (firstName, lastAction, breakupDate)

Les tokens sont stockés via `@react-native-async-storage`.

## 🚀 Déploiement

L'app est prête pour :
- **Expo Go** (développement rapide)
- **EAS Build** (builds production Expo)
- **App Store / Google Play** (distribution)

## 📝 Notes importantes

1. **IP Backend** : Si tu changes de réseau, mets à jour `.env.local` avec la nouvelle IP
2. **NativeWind cache** : Après modifier `tailwind.config.js`, relancer avec `--reset-cache`
3. **Fonts** : Les fonts système iOS/Android sont utilisées (pas de fonts custom pour l'instant)

## 🤝 Contribution

Suivre la structure existante des composants, stores, et hooks. Types TypeScript obligatoires.

## 📚 Ressources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Zustand Docs](https://zustand.surge.sh/)
- [React Query Docs](https://tanstack.com/query/latest)
