# VPN Admin Frontend

React + TypeScript + Ant Design VPN Admin Dashboard

## Features

- Node Management (Create, Read, Update, Delete)
- User Management
- Order Management
- Subscription Plans
- System Logs
- Real-time Authentication (JWT)

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design 5
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Icons**: @ant-design/icons

## Project Structure

```
client-admin/
├── src/
│   ├── api.ts              # API service layer
│   ├── App.tsx             # Main application component
│   ├── index.css           # Global styles
│   ├── index.tsx           # Entry point
│   └── NodeManagement.tsx  # Node management page
├── package.json
└── vite.config.ts
```

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## Configuration

### API Base URL

Edit `src/api.ts` to change the API base URL:

```typescript
const API_BASE_URL = 'http://localhost:3000/admin';
```

### Environment Variables

Create `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:3000/admin
```

Update `src/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Authentication

The app uses JWT authentication. Tokens are stored in `localStorage`:

```javascript
localStorage.setItem('token', jwtToken);
```

## API Endpoints

### Node Management

- `GET /admin/nodes` - Get all nodes
- `POST /admin/nodes` - Create a new node
- `GET /admin/nodes/:id` - Get node details
- `PUT /admin/nodes/:id` - Update node
- `DELETE /admin/nodes/:id` - Delete node

### User Management

- `GET /admin/users` - Get users (paginated)
- `GET /admin/users/:id` - Get user details

### Order Management

- `GET /admin/orders` - Get orders (paginated)
- `GET /admin/orders/:id` - Get order details

### Subscription Plans

- `GET /admin/subscription-plans` - Get all subscription plans
- `POST /admin/subscription-plans` - Create subscription plan
- `GET /admin/subscription-plans/:id` - Get subscription plan details
- `PUT /admin/subscription-plans/:id` - Update subscription plan
- `DELETE /admin/subscription-plans/:id` - Delete subscription plan

### Logs

- `GET /admin/logs` - Get logs (paginated)
- `DELETE /admin/logs/:id` - Delete log

## Node Entity Structure

```typescript
{
  id: string;
  name: string;
  region: string;
  protocol: string;
  address: string;
  port: number;
  path?: string;
  serverName?: string;
  delay: number;
  status: 'online' | 'offline';
  isFree: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Development

### Adding New Pages

1. Create a new component in `src/` directory
2. Add route in `App.tsx`
3. Add menu item in the sidebar

Example:

```typescript
// src/YourPage.tsx
import React from 'react';

const YourPage = () => {
  return (
    <div>
      <h1>Your Page</h1>
      {/* Your content */}
    </div>
  );
};

export default YourPage;
```

```typescript
// App.tsx
<Route path="/admin/your-page" element={<YourPage />} />
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT