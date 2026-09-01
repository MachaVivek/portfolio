/**
 * Type declarations for Ionicons web components used in JSX.
 * This tells TypeScript that <ion-icon> is a valid element.
 */

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace React.JSX {
  interface IntrinsicElements {
    "ion-icon": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      name?: string;
      src?: string;
      size?: string;
    };
  }
}
