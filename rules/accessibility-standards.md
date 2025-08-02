---
description: Maintaining high accessibility standards across the application
globs:
alwaysApply: false
---

# Accessibility Standards

Guidelines for maintaining high accessibility standards across the PeakLims SPA to ensure the application is usable by all users, including those with disabilities.

## Core Principles

1. **Perceivable** - Information must be presentable in ways users can perceive
2. **Operable** - Interface components must be operable by all users
3. **Understandable** - Information and UI operation must be understandable
4. **Robust** - Content must be robust enough to work with assistive technologies

## Semantic HTML

### Use Proper HTML Elements

Always use semantic HTML elements for their intended purpose:

```tsx
// Good - proper semantic structure
<main>
  <h1>Patient Dashboard</h1>
  <section>
    <h2>Recent Accessions</h2>
    <table>
      <thead>
        <tr>
          <th>Accession Number</th>
          <th>Patient</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ACC-2024-001</td>
          <td>John Doe</td>
          <td>In Progress</td>
        </tr>
      </tbody>
    </table>
  </section>
</main>

// Bad - divs for everything
<div>
  <div className="title">Patient Dashboard</div>
  <div>
    <div className="subtitle">Recent Accessions</div>
    <div className="data-container">
      <div className="row header">
        <div>Accession Number</div>
        <div>Patient</div>
        <div>Status</div>
      </div>
    </div>
  </div>
</div>
```

### Heading Hierarchy

Maintain proper heading hierarchy (h1 → h2 → h3, etc.):

```tsx
// Good - proper hierarchy
<main>
  <h1>Laboratory Results</h1>
  <section>
    <h2>Blood Work</h2>
    <h3>Complete Blood Count</h3>
    <h3>Chemistry Panel</h3>
  </section>
  <section>
    <h2>Imaging Studies</h2>
    <h3>X-Ray Results</h3>
  </section>
</main>

// Bad - skipping levels
<main>
  <h1>Laboratory Results</h1>
  <h4>Blood Work</h4> // Skipped h2, h3
</main>
```

## ARIA Attributes

### Labels and Descriptions

Provide clear labels and descriptions for all interactive elements:

```tsx
// Good - proper labeling
<input
  type="text"
  id="patient-mrn"
  aria-label="Patient Medical Record Number"
  aria-describedby="mrn-help"
  placeholder="Enter MRN"
/>
<div id="mrn-help">
  Medical Record Number should be 8-10 digits
</div>

// Good - using label element
<label htmlFor="sample-type">Sample Type</label>
<select id="sample-type" aria-describedby="sample-help">
  <option value="">Select sample type</option>
  <option value="blood">Blood</option>
  <option value="urine">Urine</option>
</select>
<div id="sample-help">
  Choose the type of specimen collected
</div>
```

### Dynamic Content

Use ARIA live regions for dynamic content updates:

```tsx
// Good - announcing status changes
<div aria-live="polite" aria-atomic="true">
  {status && <span>{status}</span>}
</div>

// Good - error announcements
<div aria-live="assertive" aria-atomic="true">
  {error && <span role="alert">{error}</span>}
</div>
```

### Complex Widgets

Use appropriate ARIA roles for complex components:

```tsx
// Good - accessible dropdown
<div className="dropdown">
  <button
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-controls="test-list"
    onClick={toggleDropdown}
  >
    Select Tests
  </button>
  {isOpen && (
    <ul
      id="test-list"
      role="listbox"
      aria-multiselectable="true"
    >
      <li role="option" aria-selected={selected.includes('cbc')}>
        Complete Blood Count
      </li>
    </ul>
  )}
</div>
```

## Keyboard Navigation

### Focus Management

Ensure all interactive elements are keyboard accessible:

```tsx
// Good - proper focus management
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return isOpen ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  ) : null;
};
```

### Tab Order

Maintain logical tab order:

```tsx
// Good - logical tab order with skip links
<main>
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/patients">Patients</a>
  </nav>
  <main id="main-content" tabIndex={-1}>
    <h1>Patient Details</h1>
    <form>
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
      <button type="submit">Save</button>
    </form>
  </main>
</main>
```

## Visual Design

### Color and Contrast

Ensure sufficient color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text):

```tsx
// Good - using semantic colors with sufficient contrast
<button className="bg-red-600 text-white hover:bg-red-700">
  Delete Sample
</button>

// Good - not relying solely on color
<span className="text-red-600 font-semibold">
  ⚠️ Critical Result
</span>
```

### Focus Indicators

Provide clear focus indicators:

```css
/* Good - visible focus indicators */
.btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Good - custom focus styles */
.input:focus-within {
  ring: 2px solid #3b82f6;
  ring-offset: 1px;
}
```

## Form Accessibility

### Error Handling

Provide clear, accessible error messages:

```tsx
// Good - accessible form validation
const PatientForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form noValidate>
      <div>
        <label htmlFor="mrn">Medical Record Number *</label>
        <input
          id="mrn"
          type="text"
          aria-required="true"
          aria-invalid={!!errors.mrn}
          aria-describedby={errors.mrn ? "mrn-error" : undefined}
        />
        {errors.mrn && (
          <div id="mrn-error" role="alert">
            {errors.mrn}
          </div>
        )}
      </div>
    </form>
  );
};
```

### Required Fields

Clearly indicate required fields:

```tsx
// Good - clear required field indication
<label htmlFor="patient-name">
  Patient Name <span aria-label="required">*</span>
</label>
<input
  id="patient-name"
  type="text"
  required
  aria-required="true"
/>
```

## Tables and Data

### Accessible Data Tables

Use proper table structure with headers:

```tsx
// Good - accessible table
<table>
  <caption>Patient Test Results</caption>
  <thead>
    <tr>
      <th scope="col">Test Name</th>
      <th scope="col">Result</th>
      <th scope="col">Reference Range</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Hemoglobin</th>
      <td>12.5 g/dL</td>
      <td>12.0-15.5 g/dL</td>
      <td>Normal</td>
    </tr>
  </tbody>
</table>
```

## Images and Media

### Alternative Text

Provide meaningful alt text for images:

```tsx
// Good - descriptive alt text
<img
  src="/charts/trend.png"
  alt="Patient glucose levels trending upward over 6 months"
/>

// Good - decorative images
<img
  src="/icons/decorative-border.png"
  alt=""
  role="presentation"
/>
```

## Component Library Integration

### NextUI Components

When using NextUI components, ensure accessibility props are maintained:

```tsx
// Good - accessible NextUI usage
<Button
  color="primary"
  aria-label="Add new patient record"
  onPress={handleAddPatient}
>
  <PlusIcon aria-hidden="true" />
  Add Patient
</Button>

<Input
  label="Patient Email"
  placeholder="Enter email address"
  type="email"
  isRequired
  errorMessage={emailError}
  description="We'll use this to send test results"
/>
```

## Testing Accessibility

### Automated Testing

Use accessibility testing tools in development:

```bash
# Install axe-core for automated testing
pnpm add -D @axe-core/playwright

# Run accessibility tests
pnpm test -- --grep "accessibility"
```

### Manual Testing

Regular manual testing checklist:

1. **Keyboard Navigation**: Tab through entire interface
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **High Contrast**: Check with Windows High Contrast mode
4. **Zoom**: Test at 200% and 400% zoom levels
5. **Color Blindness**: Use color blind simulators

## Common Pitfalls to Avoid

1. **Don't** use placeholder text as labels
2. **Don't** rely solely on color to convey information
3. **Don't** remove focus indicators without providing alternatives
4. **Don't** use generic link text like "click here" or "read more"
5. **Don't** auto-focus elements unless absolutely necessary
6. **Don't** create keyboard traps
7. **Don't** use positive tab indices (tabindex > 0)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)