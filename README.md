
# Checkout Builder+

## SDK Description

This project aims to simplify the Merchant’s experience when implementing the SDK within their projects, allowing greater flexibility when customizing the checkout. It is designed to be intuitive, fast, and easy to use, leveraging NextJS and React components to provide time-saving benefits for both the Merchant and Yuno.

At a high level, the system allows the integration and creation of highly customizable Checkouts that offer a wide range of options, enabling each Merchant to adapt our libraries to their needs and styles, while preserving their brand identity through Yuno’s tools.

----------

## How to Run the Project

### Prerequisites

- **Language / Runtime:** [Node.js]  
- **Minimum version:** [Bun@latest]  
- **Additional tools:** [npm, pnpm, yarn, bun]

### Steps to Execute

1. Install the SDK:

    ```bash
    npm install yuno-sdk-checkout-builder
    ```

2. Use the authentication token with Yuno:

    ```bash
    SDK.getStyle("<your-token>")
    ```

3. Render the component:

    ```bash
    SDK.Render()
    ```

4. Use payment endpoints:

    ```bash
    SDK.startPayment()
    //...
    SDK.checkStatus()
    ```

----------

## Key Technical Decisions

- **Architecture:** A layered architecture was chosen, where each layer has a well-defined responsibility. This separation of concerns enables future scalability without requiring changes to existing components.

- **Language and framework:** TypeScript and the NextJS framework were used, along with the generation of React components, due to the wide availability of libraries that accelerate development and complement the offered functionalities, as well as the team’s expertise with these technologies.

- **Dependency management:** npm and bun were used to ensure security and proper version management.

- **Other relevant decisions:**
  
  - **Bucket selection for JSON config storage:** This allows greater flexibility within the project and provides faster, direct access to the resource for loading the JSON configuration.
  
  - **Use of an iFrame (not implemented but considered) in the form:** For security reasons, no Merchant should have direct access to the generated components. Instead, access would be provided through an iFrame, preventing exposure to sensitive fields such as card numbers.

----------

## Additional Notes

- This project is currently a PoC or early prototype that showcases the main vision and immediate goals, with opportunities for growth and improvement based on the current solution.

- Future improvements include enhanced security, new features related to the Checkout Builder, and additional AI-driven implementations at different stages of the lifecycle.
