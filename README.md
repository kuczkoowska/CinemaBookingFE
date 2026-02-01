# Cinema Booking - Frontend

Aplikacja frontendowa systemu rezerwacji biletów kinowych stworzona w Angular 21 z wykorzystaniem PrimeNG, TailwindCSS i NgRx Signals.

### Technologie i zależności

- **Angular**: 21.0.0 (standalone components)
- **PrimeNG**: 21.0.2 - biblioteka komponentów UI
- **TailwindCSS**: Utility-first CSS framework
- **NgRx Signals**: 21.0.1 - state management
- **ngx-translate**: 17.0.0 - internacjonalizacja (i18n)
- **RxJS**

## Instrukcja uruchomienia

### 1. Instalacja zależności

Przed pierwszym uruchomieniem zainstaluj wszystkie wymagane pakiety:

```bash
npm install
```

### 2. Uruchomienie serwera deweloperskiego

```bash
ng serve
```

Aplikacja będzie dostępna pod adresem: **http://localhost:4200/**

## Połączenie z Backend API

Upewnij się, że backend działa na **http://localhost:8080**

Konfiguracja API znajduje się w:

- `src/environments/environment.development.ts` - tryb development

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Domyślne konta użytkowników

Po uruchomieniu backendu możesz zalogować się używając:

### Administrator

- **Email**: `admin@cinema.pl`
- **Hasło**: `admin123`

### Zwykły użytkownik

- **Email**: `user@cinema.pl`
- **Hasło**: `user123`

## 📁 Struktura projektu

```
src/
├── app/
│   ├── core/                    # Moduły główne (routing, components)
│   │   ├── admin-routing/       # Panel administratora
│   │   ├── booking-routing/     # Proces rezerwacji
│   │   ├── home-routing/        # Strona główna, lista filmów
│   │   ├── login-routing/       # Logowanie i rejestracja
│   │   └── profile-routing/     # Profil użytkownika
│   ├── guards/                  # Route guards (auth, admin, active)
│   ├── interceptors/            # HTTP interceptors
│   ├── interfaces/              # TypeScript interfaces
│   │   ├── models/              # Modele domenowe
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── form/                # Typed reactive forms
│   │   ├── filters/             # Filtry danych
│   │   ├── ui/                  # UI-specific interfaces
│   │   └── api/                 # API responses
│   ├── services/                # Serwisy HTTP
│   ├── stores/                  # NgRx Signal stores
│   ├── shell/                   # Layout (navbar, footer)
│   ├── const/                   # Stałe i konfiguracja
│   ├── enums/                   # Enumy
│   ├── pipes/                   # Custom pipes
│   ├── validators/              # Custom validators
│   └── ui/                      # Reusable UI components
├── environments/                # Konfiguracja środowisk
└── assets/
    └── i18n/                    # Tłumaczenia (pl.json, en.json)
```

## 🎨 Główne funkcjonalności

### Dla użytkowników

- 🎬 Przeglądanie repertuaru filmów
- 🎫 Rezerwacja biletów (wybór miejsc, typów biletów)
- 👤 Zarządzanie profilem
- 📜 Historia rezerwacji
- 🌐 Przełączanie języka (PL/EN)
- 🌙 Tryb ciemny/jasny

### Dla administratorów

- 🎥 Zarządzanie filmami (CRUD)
- 📅 Zarządzanie seansami
- 👥 Zarządzanie użytkownikami
- 🏛️ Zarządzanie salami kinowymi
- 💰 Konfiguracja cen biletów
- 📊 Statystyki i logi systemu

## 🌐 Internacjonalizacja (i18n)

Aplikacja obsługuje języki:

- Polski (pl)
- Angielski (en)

Pliki tłumaczeń: `public/assets/i18n/`

Przełączanie języka bez przeładowania strony dzięki `ngx-translate`.

Tylko komponenty logowania i rejestracji

## 🔄 State Management

Projekt używa **NgRx Signals** dla zarządzania stanem:

- `auth.store.ts` - autentykacja użytkownika
- `movie.store.ts` - filmy i filtrowanie
- `booking.store.ts` - proces rezerwacji
- `user.store.ts` - zarządzanie użytkownikami
- `admin-screening.store.ts`
- `repertoire.store.ts`
- `screening.store.ts`

## 🛡️ Guards i Security

### Route Guards

- `authGuard` - wymaga zalogowania
- `adminGuard` - wymaga roli ADMIN
- `activeAccountGuard` - blokuje zablokowanych użytkowników

### HTTP Interceptors

- Automatyczne dołączanie credentials do żądań
- Obsługa błędów autoryzacji

## Współpraca z Backend

Backend musi działać na `http://localhost:8080` przed uruchomieniem frontendu.

1. Uruchom backend: `cd CinemaBookingAPI/cinemabooking && ./mvnw spring-boot:run`
2. Uruchom frontend: `cd CinemaBookingFE && ng serve`
3. Otwórz przeglądarkę: `http://localhost:4200`
