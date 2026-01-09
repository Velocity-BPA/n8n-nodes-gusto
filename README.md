# n8n-nodes-gusto

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Gusto, the leading cloud-based HR platform. This node enables full integration with Gusto's payroll processing, employee management, benefits administration, time tracking, and contractor payments APIs.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **8 Resource Categories** with 40+ operations
- **OAuth 2.0 Authentication** with automatic token refresh
- **Environment Support** for Demo (sandbox) and Production APIs
- **Webhook Triggers** for real-time event notifications
- **Pagination Support** for all list operations
- **Optimistic Locking** with automatic version conflict handling

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-gusto`
5. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-gusto
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-gusto.git
cd n8n-nodes-gusto

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-gusto

# Restart n8n
n8n start
```

## Credentials Setup

### Creating OAuth2 Credentials

1. Go to [Gusto Developer Portal](https://dev.gusto.com/)
2. Create a new application
3. Note your **Client ID** and **Client Secret**
4. Add your n8n callback URL as an authorized redirect URI

### Credential Configuration

| Field | Description |
|-------|-------------|
| Environment | `Demo/Sandbox` for testing, `Production` for live data |
| Client ID | Your Gusto OAuth2 client ID |
| Client Secret | Your Gusto OAuth2 client secret |
| Scope | OAuth scopes (default: companies, employees, payrolls) |

## Resources & Operations

### Company

| Operation | Description |
|-----------|-------------|
| Get | Retrieve company information by ID |
| Get Locations | List all company locations |
| Create Location | Add a new company location |
| Get Pay Schedules | List all pay schedules |

### Employee

| Operation | Description |
|-----------|-------------|
| List | List all employees with pagination |
| Get | Retrieve a single employee by ID |
| Create | Add a new employee to the company |
| Update | Update employee information (with optimistic locking) |
| Terminate | Terminate an employee with optional final payroll |

### Job

| Operation | Description |
|-----------|-------------|
| List | List all jobs for an employee |
| Create | Create a new job assignment |
| Update | Update job details (with optimistic locking) |
| Compensation | Get/create compensations for a job |

### Payroll

| Operation | Description |
|-----------|-------------|
| List | List all payrolls with date filtering |
| Get | Retrieve a single payroll with optional includes |
| Create | Create a new unprocessed payroll |
| Update | Update payroll employee compensations |
| Submit | Submit payroll for processing |
| Calculate | Trigger tax calculations |
| Cancel | Cancel an unprocessed payroll |

### Contractor

| Operation | Description |
|-----------|-------------|
| List | List all contractors |
| Get | Retrieve a single contractor by ID |
| Create | Add a new contractor (Individual or Business) |
| Update | Update contractor information |

### Contractor Payment

| Operation | Description |
|-----------|-------------|
| List | List contractor payments with date filtering |
| Create | Create a new contractor payment |

### Time Off

| Operation | Description |
|-----------|-------------|
| List | List time off requests with status filtering |
| Get | Retrieve a single time off request |
| Create | Submit a new time off request |
| Approve | Approve a pending request |
| Deny | Deny a pending request |
| Get Policies | List company time off policies |

### Benefits

| Operation | Description |
|-----------|-------------|
| List Company Benefits | List all company benefits |
| Get Company Benefit | Retrieve a single company benefit |
| Create Company Benefit | Add a new company benefit |
| List Employee Benefits | List employee benefit enrollments |
| Create Employee Benefit | Enroll employee in a benefit |

## Trigger Node

The Gusto Trigger node listens for webhook events in real-time.

### Supported Events

| Event | Description |
|-------|-------------|
| employee.created | New employee added |
| employee.updated | Employee information changed |
| employee.terminated | Employee terminated |
| payroll.created | New payroll created |
| payroll.processed | Payroll completed |
| contractor.created | New contractor added |
| contractor_payment.created | Contractor payment made |
| time_off_request.created | Time off request submitted |
| time_off_request.approved | Time off approved |
| time_off_request.denied | Time off denied |
| company_benefit.created | New benefit added |

### Trigger Setup

1. Add the **Gusto Trigger** node to your workflow
2. Configure your Gusto credentials
3. Enter your **Company ID**
4. Select the **Event** type to listen for
5. Activate the workflow

## Usage Examples

### List All Active Employees

```javascript
// Using the Gusto node
// Resource: Employee
// Operation: List
// Company ID: your-company-uuid
// Include Terminated: false
```

### Create New Employee

```javascript
// Using the Gusto node
// Resource: Employee
// Operation: Create
// Company ID: your-company-uuid
// First Name: John
// Last Name: Doe
// Email: john.doe@example.com
// Self Onboarding: true
```

### Run Payroll

```javascript
// Step 1: Create payroll
// Resource: Payroll
// Operation: Create

// Step 2: Calculate taxes
// Resource: Payroll
// Operation: Calculate

// Step 3: Submit for processing
// Resource: Payroll
// Operation: Submit
```

## Gusto API Concepts

### Company ID

The company ID (UUID) is required for most operations. You can find it in:
- Gusto admin dashboard URL
- Company API response
- Webhook event payloads

### Optimistic Locking

Gusto uses version-based optimistic locking for updates. The node automatically:
1. Includes the version parameter in update requests
2. Handles version conflicts with automatic retry
3. Fetches the latest version on conflict

### Pagination

List operations support pagination with:
- **page**: Page number (default: 1)
- **per**: Items per page (default: 25, max: 100)

The node can automatically paginate through all results.

### Date Formats

All dates must be in `YYYY-MM-DD` format. The node automatically converts:
- JavaScript Date objects
- ISO 8601 strings
- Unix timestamps

## Environments

| Environment | Base URL |
|-------------|----------|
| Demo/Sandbox | https://api.gusto-demo.com |
| Production | https://api.gusto.com |

Use the Demo environment for testing. It provides:
- Test data that can be freely modified
- No real payroll processing
- Full API functionality

## Error Handling

The node provides detailed error messages including:
- HTTP status codes
- Gusto API error messages
- Validation errors with field details
- Version conflict indicators

Common errors:
- **401**: Invalid or expired OAuth token
- **403**: Insufficient permissions
- **404**: Resource not found
- **422**: Validation error or version conflict
- **429**: Rate limit exceeded

## Security Best Practices

1. **Use environment variables** for sensitive credentials
2. **Never commit** credentials to version control
3. **Use Demo environment** for development and testing
4. **Implement proper error handling** in production workflows
5. **Monitor webhook** endpoints for unauthorized access
6. **Rotate credentials** regularly

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass
- Code follows the existing style
- Documentation is updated

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-gusto/issues)
- **Documentation**: [Gusto API Docs](https://docs.gusto.com/)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Gusto](https://gusto.com/) for their comprehensive HR platform and API
- [n8n](https://n8n.io/) for the amazing workflow automation platform
- The n8n community for inspiration and best practices
