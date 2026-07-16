# Design Guidelines

## Summary

- Store all design export files to the [design](../design/) directory.
- Prefer simplicity over complexity.
- Ensure font size is readable and the font colour has suitable contrast against the background colour of the element.

## Front-end styling

- Keep CSS formatted and human readable, the build process will automatically minimise the final output.
- Keep the design minimal and don't use unnecessary animations or complex CSS.
- Don't repeat common values, use an existing CSS3 variable (or create a new one) in `src/styles/theme.css`.
- Use CSS3 variable features like `var()` to reference variables from `src/styles/theme.css`.
