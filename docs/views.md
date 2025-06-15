# Views Customization Guide

This guide covers customizing all UI views in the MCP Startup Framework, including authentication screens, payment pages, and error pages.

## Overview

All views are fully customizable HTML templates with:
- **🌙 Dark/Light Mode Support** - Automatic theme detection with manual toggle
- **📱 Responsive Design** - Mobile-first with Tailwind CSS
- **🎨 Custom Branding** - Easy logo, colors, and styling customization
- **⚡ Interactive JavaScript** - Client-side validation and UX enhancements
- **🔒 Security Features** - CSRF protection and secure form handling

## Available Views

### Authentication Views
- **Login Page** (`/login`) - User sign-in
- **Registration Page** (`/register`) - New user signup
- **OAuth Consent** (`/auth/authorize`) - Permission grant screen

### Payment Views
- **Payment Success** (`/payment-success`) - Successful payment confirmation
- **Payment Cancelled** (`/payment-cancelled`) - Cancelled payment notification
- **Subscription Management** - Manage active subscriptions

### Error Pages
- **404 Not Found** - Custom 404 page
- **500 Server Error** - Server error page
- **401 Unauthorized** - Authentication required

## OAuth Consent Screen

Located in `src/auth/views/consent.ts`:

```typescript
export function generateConsentPage(data: ConsentPageData, config: ConsentPageConfig = {}) {
  const {
    title = "Authorize Application",
    subtitle = "Grant permissions to",
    logoUrl = "/logo.png",
    brandColor = "purple",
    companyName = "Your Company"
  } = config;
  
  return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Consent UI -->
      </div>
    </body>
    </html>`;
}
```

### Customizing Consent Screen

```typescript
// In your consent handler
const customConfig = {
  title: "Connect Your Account",
  logoUrl: "https://yourapp.com/logo.png",
  brandColor: "blue",
  scopes: {
    "read:profile": "View your profile information",
    "write:data": "Create and modify your data"
  }
};

return generateConsentPage(data, customConfig);
```

## Login Page

Create or modify `src/auth/views/login.ts`:

```typescript
export function generateLoginPage(config: LoginPageConfig = {}) {
  const {
    title = "Sign In",
    logoUrl = "/logo.png",
    brandColor = "blue",
    showSocialLogin = false,
    socialProviders = [],
    forgotPasswordUrl = "/forgot-password"
  } = config;
  
  return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <img class="mx-auto h-12 w-auto" src="${logoUrl}" alt="Logo">
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              ${title}
            </h2>
          </div>
          <form class="mt-8 space-y-6" action="/login" method="POST">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email" class="sr-only">Email address</label>
                <input id="email" name="email" type="email" required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 
                  border border-gray-300 placeholder-gray-500 text-gray-900 
                  rounded-t-md focus:outline-none focus:ring-${brandColor}-500 
                  focus:border-${brandColor}-500 focus:z-10 sm:text-sm" 
                  placeholder="Email address">
              </div>
              <div>
                <label for="password" class="sr-only">Password</label>
                <input id="password" name="password" type="password" required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 
                  border border-gray-300 placeholder-gray-500 text-gray-900 
                  rounded-b-md focus:outline-none focus:ring-${brandColor}-500 
                  focus:border-${brandColor}-500 focus:z-10 sm:text-sm" 
                  placeholder="Password">
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <a href="${forgotPasswordUrl}" 
                class="text-sm text-${brandColor}-600 hover:text-${brandColor}-500">
                Forgot your password?
              </a>
            </div>
            
            <button type="submit" 
              class="group relative w-full flex justify-center py-2 px-4 
              border border-transparent text-sm font-medium rounded-md 
              text-white bg-${brandColor}-600 hover:bg-${brandColor}-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-${brandColor}-500">
              Sign in
            </button>
            
            ${showSocialLogin ? generateSocialButtons(socialProviders) : ''}
          </form>
        </div>
      </div>
    </body>
    </html>`;
}
```

## Registration Page

Create `src/auth/views/register.ts`:

```typescript
export function generateRegistrationPage(config: RegistrationPageConfig = {}) {
  const {
    title = "Create Account",
    requireEmailVerification = true,
    additionalFields = [],
    termsUrl = "/terms",
    privacyUrl = "/privacy",
    passwordRequirements = {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true
    }
  } = config;
  
  return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        function validatePassword() {
          const password = document.getElementById('password').value;
          const requirements = ${JSON.stringify(passwordRequirements)};
          // Add password validation logic
        }
      </script>
    </head>
    <body>
      <!-- Registration form -->
    </body>
    </html>`;
}
```

## Payment Success Page

Create `src/auth/views/payment-success.ts`:

```typescript
export function generatePaymentSuccessPage(
  userContext: UserContext,
  paymentDetails: PaymentDetails,
  config: PaymentPageConfig = {}
) {
  const {
    title = "Payment Successful!",
    logoUrl = "/logo.png",
    brandColor = "green",
    showConfetti = true,
    redirectUrl = "/dashboard",
    redirectDelay = 5000
  } = config;
  
  return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      ${showConfetti ? '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>' : ''}
    </head>
    <body>
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div class="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-${brandColor}-100">
              <svg class="h-6 w-6 text-${brandColor}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">${title}</h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Thank you, ${userContext.name}! Your payment has been processed successfully.
            </p>
          </div>
          
          <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-600 dark:text-gray-400">Amount</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  $${(paymentDetails.amount / 100).toFixed(2)}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-600 dark:text-gray-400">Plan</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  ${paymentDetails.planName}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-600 dark:text-gray-400">Transaction ID</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  ${paymentDetails.transactionId}
                </dd>
              </div>
            </dl>
          </div>
          
          <div class="mt-8">
            <a href="${redirectUrl}" 
              class="w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white 
              bg-${brandColor}-600 hover:bg-${brandColor}-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-${brandColor}-500">
              Continue to Dashboard
            </a>
            <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              You will be redirected in <span id="countdown">5</span> seconds...
            </p>
          </div>
        </div>
      </div>
      
      <script>
        ${showConfetti ? 'confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });' : ''}
        
        let seconds = ${redirectDelay / 1000};
        const countdown = document.getElementById('countdown');
        
        const timer = setInterval(() => {
          seconds--;
          countdown.textContent = seconds;
          if (seconds <= 0) {
            clearInterval(timer);
            window.location.href = '${redirectUrl}';
          }
        }, 1000);
      </script>
    </body>
    </html>`;
}
```

## Payment Cancelled Page

Create `src/auth/views/payment-cancelled.ts`:

```typescript
export function generatePaymentCancelledPage(
  userContext: UserContext,
  config: PaymentPageConfig = {}
) {
  const {
    title = "Payment Cancelled",
    message = "Your payment was cancelled. No charges were made.",
    showRetryButton = true,
    retryUrl = "/upgrade",
    contactEmail = "support@example.com"
  } = config;
  
  return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div class="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                </path>
              </svg>
            </div>
            <h2 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">${title}</h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">${message}</p>
          </div>
          
          <div class="mt-8 space-y-3">
            ${showRetryButton ? `
              <a href="${retryUrl}" 
                class="w-full flex justify-center py-2 px-4 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-white 
                bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500">
                Try Again
              </a>
            ` : ''}
            
            <a href="/dashboard" 
              class="w-full flex justify-center py-2 px-4 border border-gray-300 
              rounded-md shadow-sm text-sm font-medium text-gray-700 
              bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500">
              Return to Dashboard
            </a>
          </div>
          
          <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact us at 
            <a href="mailto:${contactEmail}" class="text-blue-600 hover:text-blue-500">
              ${contactEmail}
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>`;
}
```

## Error Pages

### 404 Not Found

```typescript
export function generate404Page(config: ErrorPageConfig = {}) {
  const {
    title = "Page Not Found",
    message = "Sorry, we couldn't find the page you're looking for.",
    homeUrl = "/"
  } = config;
  
  return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-6xl font-semibold text-blue-600">404</p>
          <h1 class="mt-2 text-4xl font-bold text-gray-900">${title}</h1>
          <p class="mt-2 text-base text-gray-600">${message}</p>
          <div class="mt-6">
            <a href="${homeUrl}" class="text-base font-medium text-blue-600 hover:text-blue-500">
              Go back home<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>`;
}
```

## Shared Components

Create reusable components for consistency:

### Dark Mode Toggle

```javascript
function darkModeToggle() {
  return `
    <button id="theme-toggle" type="button" 
      class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 
      dark:hover:bg-gray-700 focus:outline-none focus:ring-4 
      focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg 
      text-sm p-2.5">
      <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
      </svg>
      <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    </button>
    
    <script>
      // Dark mode toggle logic
      const toggle = document.getElementById('theme-toggle');
      const darkIcon = document.getElementById('theme-toggle-dark-icon');
      const lightIcon = document.getElementById('theme-toggle-light-icon');
      
      // Initialize theme
      if (localStorage.theme === 'dark' || 
          (!('theme' in localStorage) && 
           window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        lightIcon.classList.remove('hidden');
      } else {
        darkIcon.classList.remove('hidden');
      }
      
      toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        darkIcon.classList.toggle('hidden');
        lightIcon.classList.toggle('hidden');
        
        localStorage.theme = document.documentElement.classList.contains('dark') 
          ? 'dark' : 'light';
      });
    </script>
  `;
}
```

### Loading States

```javascript
function loadingButton(text = "Processing...") {
  return `
    <button type="submit" disabled 
      class="w-full flex justify-center py-2 px-4 border border-transparent 
      rounded-md shadow-sm text-sm font-medium text-white 
      bg-gray-400 cursor-not-allowed">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      ${text}
    </button>
  `;
}
```

## Best Practices

### 1. Consistent Branding
- Use the same color scheme across all views
- Keep logos and fonts consistent
- Maintain similar layouts for familiarity

### 2. Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

### 3. Performance
- Minimize inline CSS/JS
- Use CDN for common libraries
- Lazy load non-critical resources
- Optimize images

### 4. Security
- Always include CSRF tokens
- Sanitize user inputs
- Use Content Security Policy headers
- Validate on both client and server

### 5. Mobile-First
- Test on various devices
- Use responsive units (rem, %, vw)
- Ensure touch targets are large enough
- Consider mobile data usage

## Testing Views

```typescript
// In development, add a route to preview views
backend.route('GET', '/preview/:view', (c) => {
  const view = c.req.param('view');
  
  switch(view) {
    case 'login':
      return c.html(generateLoginPage());
    case 'register':
      return c.html(generateRegistrationPage());
    case 'payment-success':
      return c.html(generatePaymentSuccessPage(mockUser, mockPayment));
    // Add more cases
    default:
      return c.html(generate404Page());
  }
});
```

## Deployment Considerations

1. **CDN Resources**: Consider self-hosting Tailwind CSS for production
2. **Caching**: Set appropriate cache headers for static resources
3. **Compression**: Enable gzip/brotli for HTML responses
4. **Analytics**: Add tracking codes if needed
5. **A/B Testing**: Implement view variations for optimization 