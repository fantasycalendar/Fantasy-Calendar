# AGENTS.md - Fantasy Calendar Project

## Project Overview

**Fantasy Calendar** is a sophisticated SaaS web application for creating, managing, and tracking custom calendars for fantasy worlds. It serves Game Masters, authors, and world-builders who need complex timekeeping systems with unique features like multiple moons, custom leap days, and unusual celestial configurations.

**Live Application:** app.fantasy-calendar.com  
**Tech Stack:** Laravel 10.x (PHP 8.1+), Alpine.js, TailwindCSS, AWS Serverless  
**Architecture:** Serverless (AWS Lambda, API Gateway, RDS, ElastiCache, SQS)

---

## Technology Stack

### Backend
- **PHP 8.1+** with **Laravel 10.x** framework
- **MySQL/MariaDB** with Doctrine DBAL
- **Redis** for caching and session management
- **Bref** for AWS Lambda integration
- **Filament 3.x** admin panel framework
- **Laravel Sanctum** for API authentication
- **Laravel Cashier** for Stripe subscription management
- **Intervention Image** for image rendering
- **GMP Extension** for complex mathematical calculations

### Frontend
- **Alpine.js 3.x** for reactive components
- **jQuery 3.x** for legacy DOM manipulation
- **TailwindCSS 3.x** for styling
- **Mustache.js** for template rendering
- **Chart.js** for data visualization
- **SweetAlert2** for modal dialogs
- **Trumbowyg** WYSIWYG editor

### Infrastructure & DevOps
- **Docker & Docker Compose** for development
- **Serverless Framework** for AWS deployment
- **AWS Services:** Lambda, S3, CloudFront, API Gateway, SQS, RDS, ElastiCache
- **Laravel Mix/Webpack** for asset compilation
- **PHPUnit & Laravel Dusk** for testing

---

## Project Structure

```
Fantasy-Calendar-master/
├── app/
│   ├── Console/Commands/      # 21 custom Artisan commands
│   ├── Filament/              # Admin panel resources & widgets
│   ├── Http/
│   │   ├── Controllers/       # Web & API controllers
│   │   ├── Middleware/        # Custom middleware (Premium, AccountDeletion, etc.)
│   │   └── Resources/         # API transformers (Fractal)
│   ├── Jobs/                  # 10 queue jobs (advancement, rendering, webhooks)
│   ├── Models/                # 16 core Eloquent models
│   ├── Policies/              # Authorization policies
│   ├── Services/              # Business logic services
│   │   ├── CalendarService/   # Core calendar calculation engine
│   │   ├── RendererService/   # Image & text rendering
│   │   ├── Discord/           # Discord bot integration
│   │   ├── EpochService/      # Date conversion between calendars
│   │   └── Webhooks/          # Webhook handling
│   └── helpers.php            # Global helper functions
│
├── database/
│   ├── migrations/            # 60+ database migrations
│   └── seeders/presets/       # Calendar preset templates (JSON)
│
├── resources/
│   ├── js/
│   │   ├── calendar/          # Core calendar logic (13 files)
│   │   ├── components/        # Reusable components
│   │   ├── webworkers/        # Web workers for heavy computations
│   │   └── *.js               # Feature modules
│   ├── sass/                  # Source stylesheets
│   └── views/                 # Blade templates
│
├── routes/
│   ├── web.php                # Web routes
│   ├── api_v1.php             # API v1 routes
│   └── api_v2.php             # API v2 routes (future)
│
├── setup/                     # Docker & deployment configs
├── tests/                     # PHPUnit & Dusk tests
├── docker-compose.yml         # Development environment
├── serverless.yml             # AWS Lambda deployment config
└── makefile                   # Build automation
```

---

## Core Functionality

### 1. Calendar Creation & Management
- **Custom Calendar Builder** with full control over:
  - Months/timespans with varying lengths
  - Custom weekdays and week structures
  - Complex leap day intervals (e.g., "every 4 years, except every 100, except every 400")
  - Multiple moons with custom orbital cycles
  - Seasons with transitions and weather patterns
  - Historical eras with custom date formatting
  - Configurable 24-hour clock systems

- **Preset Calendars:**
  - Gregorian (real world)
  - Forgotten Realms, Eberron, Exandria (D&D settings)
  - Custom community presets

### 2. Event Management
- Create events on specific calendar dates
- Rich text descriptions with HTML editor (sanitized)
- Event categories with custom colors
- Event comments and discussions
- Sorting, filtering, and bulk operations
- Events Manager for advanced organization

### 3. Real-Time Calendar Advancement
- Automatically advance calendar date based on real-world time
- Configurable advancement rates (e.g., "1 fantasy day per real hour")
- Discord webhook notifications on date changes
- Timezone-aware scheduling with drift prevention
- Queue-based processing for reliability

### 4. Calendar Sharing & Collaboration
- Invite users to view or co-own calendars
- Role-based permissions (owner, co-owner, viewer)
- Parent-child calendar linking for synchronized worlds
- Calendar cloning/duplication

### 5. Rendering & Export
- **Image Renderer:** Generate PNG/JPG/WEBP calendar images
  - Multiple themes (light, dark, custom colors)
  - Configurable sizes and quality
  - Event markers, moon phases, current date indicators
  - Caching for performance
- **Text Renderer:** ASCII output for Discord/terminals
- **JSON Export:** Complete calendar structure
- **Embeddable Widgets:** Iframe widgets for websites

### 6. API Access (Premium Feature)
- RESTful API v1 and v2
- Sanctum token authentication
- Full CRUD operations on calendars and events
- Webhooks for calendar change notifications
- Programmatic rendering endpoints

### 7. Subscription System
- Stripe integration via Laravel Cashier
- Multiple tiers: Timekeeper, Chronicler, Sage
- Monthly and yearly billing options
- Coupon support
- Customer portal for self-service management
- Premium features: API access, unlimited calendars, image rendering

### 8. Discord Integration
- OAuth login with Discord accounts
- Discord bot with slash commands
- Calendar interaction directly from Discord
- Webhook notifications for calendar updates
- Daily statistics reporting to Discord channels

### 9. Admin Panel (Filament)
- User and calendar management
- Subscription analytics dashboard
- Statistics visualization with Chart.js
- Policy and legal agreement management
- User impersonation for support

---

## Key Components

### Models (app/Models/)
- **Calendar** - Core model storing structure and state (`static_data`, `dynamic_data`)
- **User** - User accounts with premium subscriptions
- **CalendarEvent** - Events placed on calendar dates
- **EventCategory** - Event organization
- **CalendarUserRole** - Calendar sharing permissions
- **Preset** - Template calendars
- **CalendarInvite** - Invitation system
- **Webhook** - User-defined webhooks
- **UserIntegration** - Discord integration data
- **UserAgreement** - Terms of service tracking

### Services (app/Services/)

#### CalendarService/
- **Date.php** - Core date calculation engine
- **Month.php** - Month representation and logic
- **LeapDay.php** - Complex leap day interval calculations
- **Moon.php** - Moon phase calculations
- **Era.php** - Historical era management
- **Timespan.php** - Generic time period handling
- **Interval.php** - Date interval calculations

#### RendererService/
- **ImageRenderer.php** - Generates calendar images (PNG/JPG/WEBP)
- **TextRenderer.php** - ASCII/text calendar output
- **MonthRenderer.php** - Month-specific rendering logic

#### Other Services
- **Discord/** - Full Discord bot integration
- **EpochService/** - Date conversion between calendars
- **Statistics.php** - Analytics service
- **Webhooks/** - Webhook dispatch handling

### Jobs (app/Jobs/)
1. **AdvanceCalendarWithRealTime** - Real-time calendar progression
2. **AdvanceRealTimeCalendars** - Batch advancement scheduler
3. **CloneCalendar** - Deep copy calendars with events
4. **ConvertCalendarToPreset** - Export calendar as preset
5. **HitCalendarUpdateWebhook** - Discord webhook notifications
6. **PrepCalendarForExport** - Generate exportable data
7. **SaveCalendarEvents** - Batch event creation
8. **SaveEventCategories** - Batch category creation
9. **SyncCalendarChild** - Parent-child synchronization
10. **UpdateCalendarPreset** - Preset update propagation

### Controllers (app/Http/Controllers/)

**Web:**
- **CalendarController** - CRUD operations, rendering, export
- **SubscriptionController** - Stripe subscription management
- **SettingsController** - User profile and API tokens
- **InviteController** - Calendar sharing
- **EmbedController** - Embeddable widgets

**API v1:**
- **CalendarController** - Full calendar API
- **CalendarEventController** - Event management
- **EventCategoryController** - Category management
- **CalendarRendererController** - Programmatic rendering
- **UserController** - Authentication and user data

### Middleware (app/Http/Middleware/)
- **AccountDeletion** - Handle pending account deletions
- **Agreement** - Enforce terms of service acceptance
- **Premium** - Gate premium features
- **Feature flags** - Conditional feature access

---

## Development Workflow

### Setup (Docker)
```bash
# Initialize development environment
make

# Start all containers
docker-compose up

# Enable hot reloading with BrowserSync
make hotreload

# Access application
open http://localhost:9980
```

### Docker Containers
1. **fc-mariadb** - MariaDB 10.6 database
2. **fantasy_calendar_php** - PHP 8.1 FPM with Bref extensions
3. **fc_queue_worker** - Background job processor
4. **selenium** - Headless Chrome for Dusk tests
5. **fcredis** - Redis cache/session store
6. **npm** - Node 20 for asset watching
7. **composer** - Composer dependency installer
8. **mailpit** - Local email testing (port 8025)

### Useful Commands
```bash
# Artisan commands
docker-compose exec fantasy_calendar_php php artisan <command>

# Run tests
docker-compose exec fantasy_calendar_php php artisan test

# Queue worker
docker-compose exec fantasy_calendar_php php artisan queue:work

# Asset compilation
npm run dev          # Development build
npm run watch        # Watch for changes
npm run production   # Production build
```

### Key Artisan Commands
- `calendar:import` - Import legacy calendars
- `calendar:change-watch` - Monitor calendar changes
- `discord:register-commands` - Deploy Discord bot
- `schedule:run` - Run scheduled tasks (advancement, cleanups)
- `queue:listen` - Process background jobs
- `render:generate` - Pre-generate calendar images
- `accounts:delete` - Process account deletion requests
- `invites:clean` - Remove expired invitations

---

## Testing

### Test Suite (PHPUnit)
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/Calendar/CalendarDateTest.php

# Run with coverage
php artisan test --coverage
```

### Test Categories

**Unit Tests:**
- `IntervalTest.php` - Leap day interval calculations

**Feature Tests:**
- **Calendar:**
  - `CalendarDateTest.php` - Date validation and calculations
  - `AdvancementTest.php` - Real-time advancement logic
  - `EdgeCaseCalendarsTest.php` - Complex calendar configurations
  
- **Rendering:**
  - `ImageRendererTest.php` - Image generation
  - `TextRendererTest.php` - Text output

- **API:**
  - `CalendarTest.php` - API v1 calendar endpoints
  - `UserTest.php` - API v1 user endpoints

**Browser Tests (Dusk):**
- `UserLoginsTest.php` - Authentication flows

---

## Deployment

### AWS Serverless Architecture

**Services:**
- **CloudFront** - CDN and SSL termination
- **API Gateway** - Routes requests to Lambda
- **Lambda Functions:**
  - `web` - Main application (28s timeout)
  - `artisan` - CLI commands (120s timeout)
  - `worker` - Queue job processor (59s timeout)
  - `console` - Scheduled tasks (6s timeout, runs every minute)
- **S3** - Static asset hosting
- **RDS MySQL** - Database (VPC private subnet)
- **ElastiCache Redis** - Cache/sessions (VPC private subnet)
- **SQS** - Job queue with dead letter queue
- **Route53** - DNS management
- **ACM** - SSL certificates

**Environments:**
- **Production:** app.fantasy-calendar.com
- **Beta:** beta.fantasy-calendar.com

### Deployment Commands
```bash
# Deploy to production
make deploy_prod

# Deploy to beta
make deploy_dev

# Deploy serverless stack only
serverless deploy --stage prod

# Deploy assets to S3
aws s3 sync public/ s3://fantasy-calendar-assets --exclude "*.php"
```

---

## API Documentation

### Authentication
All API requests require a Sanctum token in the `Authorization` header:
```
Authorization: Bearer {token}
```

Generate tokens in Profile > Settings > API Tokens.

### Base URLs
- **Production:** https://app.fantasy-calendar.com/api/v1
- **Beta:** https://beta.fantasy-calendar.com/api/v1

### Key Endpoints

**Calendars:**
- `GET /api/v1/calendars` - List user's calendars
- `GET /api/v1/calendars/{id}` - Get calendar details
- `POST /api/v1/calendars` - Create calendar
- `PUT /api/v1/calendars/{id}` - Update calendar
- `DELETE /api/v1/calendars/{id}` - Delete calendar

**Events:**
- `GET /api/v1/calendars/{id}/events` - List calendar events
- `POST /api/v1/calendars/{id}/events` - Create event
- `PUT /api/v1/events/{id}` - Update event
- `DELETE /api/v1/events/{id}` - Delete event

**Rendering:**
- `GET /api/v1/calendars/{id}/render/image` - Generate calendar image
- `GET /api/v1/calendars/{id}/render/text` - Generate text calendar

**User:**
- `GET /api/v1/user` - Get current user
- `GET /api/v1/user/calendars` - List user's calendars

---

## Configuration

### Environment Variables
See `.env.example` for all configuration options. Key variables:

**Application:**
- `APP_NAME` - Application name
- `APP_ENV` - Environment (local, production)
- `APP_DEBUG` - Enable debug mode
- `APP_URL` - Application URL

**Database:**
- `DB_CONNECTION` - Database driver (mysql, mariadb)
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

**Cache & Session:**
- `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`
- `CACHE_DRIVER=redis`
- `SESSION_DRIVER=redis`

**Queue:**
- `QUEUE_CONNECTION` - Queue driver (sqs for production)
- `SQS_PREFIX`, `SQS_QUEUE`, `SQS_REGION`

**Stripe:**
- `STRIPE_KEY`, `STRIPE_SECRET`
- `CASHIER_CURRENCY`, `CASHIER_CURRENCY_LOCALE`

**Discord:**
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`
- `DISCORD_BOT_TOKEN`

**AWS:**
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION`, `AWS_BUCKET`

### Feature Flags
Calendar rendering features can be toggled in `config/fantasycalendar.php`:
```php
'rendering' => [
    'image' => [
        'enabled' => true,
        'quality' => 90,
        'cache_ttl' => 3600,
    ],
],
```

---

## Architecture Patterns

### Service Layer Pattern
Business logic is extracted into dedicated service classes in `app/Services/`:
- Keeps controllers thin
- Enables code reuse
- Simplifies testing
- Clear separation of concerns

### Repository Pattern
Models act as repositories with Eloquent:
- Encapsulate data access logic
- Provide query scopes for common filters
- Use observers for lifecycle events

### Job Pattern
Heavy operations are queued for background processing:
- Real-time calendar advancement
- Image rendering and caching
- Webhook dispatch
- Calendar cloning and exports
- Event batch operations

### Observer Pattern
Model events trigger observers (app/Observers/):
- `CalendarObserver` - Handle calendar lifecycle
- Automatic cleanup on deletion
- Audit logging

### Policy Pattern
Authorization logic in policies (app/Policies/):
- `CalendarPolicy` - Calendar access control
- `CalendarEventPolicy` - Event permissions
- `PresetPolicy` - Preset management
- Role-based access via `CalendarUserRole`

### Transformer Pattern
API responses use Fractal transformers (app/Transformer/):
- Consistent API response format
- Include/embed related resources
- Version-specific transformations

---

## Key Files for AI Agents

When working with this codebase, these files are particularly important:

### Core Application Logic
- `app/Services/CalendarService/Date.php` - Core calendar calculation engine
- `app/Services/CalendarService/Interval.php` - Leap day interval logic
- `app/Models/Calendar.php` - Central calendar model
- `app/Http/Controllers/CalendarController.php` - Main calendar controller

### Frontend JavaScript
- `resources/js/calendar/calendar.js` - Main calendar UI logic
- `resources/js/calendar/calendar_builder.js` - Calendar creation UI
- `resources/js/webworkers/worker_calendar.js` - Background calculations

### Rendering
- `app/Services/RendererService/ImageRenderer.php` - Image generation
- `app/Services/RendererService/TextRenderer.php` - Text output

### API
- `routes/api_v1.php` - API route definitions
- `app/Http/Controllers/API/v1/CalendarController.php` - API endpoints
- `app/Transformer/CalendarTransformer.php` - API response formatting

### Configuration
- `config/fantasycalendar.php` - App-specific configuration
- `database/migrations/` - Database schema evolution
- `database/seeders/presets/` - Calendar preset definitions (JSON)

### Testing
- `tests/Feature/Calendar/CalendarDateTest.php` - Calendar logic tests
- `tests/Feature/Calendar/AdvancementTest.php` - Real-time advancement tests
- `tests/Feature/Rendering/ImageRendererTest.php` - Rendering tests

---

## Common Tasks

### Adding a New Calendar Feature
1. Update `Calendar` model's `static_data` schema
2. Add migration if database changes needed
3. Update `CalendarService/Date.php` for calculation logic
4. Add UI in `resources/js/calendar/calendar_builder.js`
5. Update API transformer if exposed via API
6. Add tests in `tests/Feature/Calendar/`

### Adding a New API Endpoint
1. Add route to `routes/api_v1.php`
2. Create controller method in `app/Http/Controllers/API/v1/`
3. Create/update transformer in `app/Transformer/`
4. Add authorization to policy
5. Add tests in `tests/Feature/API/`

### Adding a New Background Job
1. Create job class in `app/Jobs/`
2. Dispatch job from controller/command
3. Configure queue settings in `config/queue.php`
4. Add job to SQS queue in serverless.yml
5. Test job execution

### Modifying Calendar Rendering
1. Update renderer in `app/Services/RendererService/`
2. Adjust image generation parameters
3. Update cache invalidation logic
4. Test rendering with various calendar configurations
5. Update tests in `tests/Feature/Rendering/`

---

## Performance Considerations

### Caching Strategy
- **Redis Cache:** Calendar data, user sessions, rate limiting
- **Image Cache:** Rendered calendar images (configurable TTL)
- **Query Cache:** Frequently accessed calendar structures
- **CDN Cache:** Static assets via CloudFront

### Optimization Techniques
- Eager loading to prevent N+1 queries
- Database indexes on frequently queried columns
- Queue processing for heavy operations
- Web workers for client-side calculations
- Asset versioning and minification
- Lazy loading of calendar components

### Monitoring
- Sentry for error tracking
- Flare for error reporting
- Discord webhooks for critical errors
- Laravel Telescope for local debugging (disabled in production)
- CloudWatch logs for Lambda functions

---

## Security Measures

- **HTML Purifier** - Sanitize user-generated HTML content
- **CSRF Protection** - All forms include CSRF tokens
- **Honeypot** - Spam prevention on public forms
- **Rate Limiting** - API endpoints have rate limits
- **Policy Authorization** - All actions check permissions
- **Signed URLs** - Sensitive actions require signed URLs
- **XSS Headers** - Content Security Policy headers
- **SQL Injection Protection** - Eloquent ORM with parameter binding
- **Password Hashing** - Bcrypt with Laravel's Hash facade
- **API Token Encryption** - Sanctum tokens are hashed

---

## Contributing Guidelines

### Code Style
- Follow PSR-12 coding standards
- Use Laravel conventions and best practices
- Type hint all method parameters and return types
- Write PHPDoc blocks for all public methods
- Use meaningful variable and method names

### Git Workflow
1. Create feature branch from `main`
2. Make atomic commits with clear messages
3. Write/update tests for new features
4. Ensure all tests pass
5. Submit pull request with description

### Pull Request Checklist
- [ ] Tests pass (`php artisan test`)
- [ ] Code follows style guidelines
- [ ] Database migrations are reversible
- [ ] API changes are documented
- [ ] No sensitive data in commits
- [ ] Feature flags added for experimental features

---

## Troubleshooting

### Common Issues

**Calendar Not Advancing:**
- Check queue worker is running: `docker-compose logs fc_queue_worker`
- Verify cron schedule: `php artisan schedule:list`
- Check calendar's `real_time_date` in database

**Image Rendering Fails:**
- Verify ImageMagick/GD extension installed
- Check disk space for temp files
- Review `storage/logs/laravel.log` for errors
- Clear cache: `php artisan cache:clear`

**Database Connection Errors:**
- Verify database credentials in `.env`
- Check database container is running: `docker-compose ps`
- Test connection: `php artisan db:show`

**Assets Not Compiling:**
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `npm install`
- Check for JavaScript syntax errors in console

### Debug Commands
```bash
# View logs
tail -f storage/logs/laravel.log

# Clear all caches
php artisan optimize:clear

# Check database status
php artisan db:show

# List scheduled tasks
php artisan schedule:list

# Test queue connection
php artisan queue:work --once

# View routes
php artisan route:list
```

---

## Resources

### Documentation
- [Laravel Documentation](https://laravel.com/docs/10.x)
- [Alpine.js Documentation](https://alpinejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Filament Documentation](https://filamentphp.com/docs)
- [Bref Documentation](https://bref.sh/docs/)

### Community
- [GitHub Repository](https://github.com/fantasycalendar/Fantasy-Calendar)
- [Discord Server](https://discord.gg/fantasy-calendar)
- [Bug Reports & Feature Requests](https://github.com/fantasycalendar/Fantasy-Calendar/issues)

### Internal Documentation
- `public/changelog.md` - Version history
- `public/policies/` - Legal documents
- `/faq` - Frequently asked questions
- In-app help tooltips and documentation

---

## License & Legal

- See `public/policies/Terms of Service.md` for terms
- See `public/policies/GDPR Privacy Policy.md` for privacy policy
- See `public/policies/DMCA Policy.md` for copyright policy

---

**Last Updated:** February 2026  
**Maintainer:** Fantasy Calendar Development Team
