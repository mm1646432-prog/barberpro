/**
 * Razor-gold hairline divider used between every major page section.
 * Matches the `.section-divider` CSS class defined in globals.css,
 * but as a typed React component for use in JSX trees.
 */
export function SectionDivider(): React.JSX.Element {
  return <hr className="section-divider" aria-hidden="true" />;
}