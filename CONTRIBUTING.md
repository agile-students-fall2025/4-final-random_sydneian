# Contributing Guide

Welcome to Rendezvous! Here's a few things about our process to ensure you can contribution smoothly.

## Contributing Rules

We welcome all positive contributions! Whether it's fixing typos or adding features, if you see something that can be improved, we encourage you to share your ideas.

Please create an issue before working on anything, especially significant changes or new features, as it allows the team to discuss and give feedback, before you spend time working on something that might not fit the project. Also, please test your code and ensure it follows our conventions.

## Contributing Workflow

### Getting the code

1. Clone the repo (and navigate into it).
   ```bash
   $ git clone https://github.com/agile-students-fall2025/4-final-random_sydneian.git
   $ cd 4-final-random_sydneian
   ```
1. Activate the git hooks.
   ```bash
   $ git config core.hooksPath .githooks
   ```

### Setting up local development environment

1. Create and switch to a new branch (this project follows the [feature branch workflow](https://knowledge.kitchen/content/courses/agile-development-and-devops/conventions/#follow-a-feature-branch-workflow)).
   ```bash
   $ git checkout -b <branch-name>
   ```
1. Ensure your editor's extensions for ESLint and Prettier are installed and working.
1. Go into the desired directory (eg. front-end).
   ```bash
   $ cd front-end
   ```
1. Install the dependencies.
   ```bash
   $ npm install
   ```
1. Make your modifications (commit often, and ensure commit messages are single line and follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard).

### Building and testing the project

1. Ensure your code is formatted and has no linting errors.
   ```bash
   $ npm run fix-format-lint
   ```
1. Serve the project.
   ```bash
   $ npm run dev
   ```
1. If you wish to build out the project, you can use:
   ```bash
   $ npm run build
   ```

### Submitting your changes

1. Double check your code is formatted and has no linting errors.
   ```bash
   $ npm run fix-format-lint
   ```
1. Push your work.
   ```bash
   $ git push -u origin <branch-name>
   ```
1. Create a pull request.
1. A maintainer will review the PR, raising any issues.
1. Once any potential issues are resolved, the PR is merged!

## Team Norms

This section is mostly for team members (maintainers).

### Team values

- We will work together peacefully and cooperatively.
- We are responsible for the code we write and review.
- We will communicate over our team's Discord channels, and check them at least every other day.
- If anyone needs help with something, they can ask for help/feedback in our team Discord or on their draft PRs.
- In case of conflicts or disagreements about certain features/directions/work, the option which the majority of team members (at least 50%) prefer will be followed. In case no consensus can be reached, the Product Owner will decide.
- If someone doesn't respond within 3 days, we will try to reach out to them as best we can (including potentially over other channels). If there is still no response after a week, the professor/graders are notified.
- If someone fails to complete their work in time for a sprint, they are allowed an extra week, after which the professor/graders are notified.

### Sprint cadence

- Each sprint is 2 weeks long.

### Daily standups

- Schedule

  - Monday, at 10:45 AM (virtual)
  - Tuesday, at 12:00 PM (in person)
  - Thursday, at 11:00 AM (virtual)
  <!-- We should probably move one of the sessions around. Maybe Monday to Sunday? -->

- Each session is around 15 mins long.

### Coding standards

- Editor: VS Code
- Linting: Eslint
- Formatting: Prettier
- POSIX compatible shell (Windows needs WSL).
- Pre commit hook to ensure single line commit messages.
- Code must be working, free of bugs, and peer-reviewed before merging into the master branch (if your change breaks something, please fix it)
- Make granular and small commits, per feature or per bug fix.
- Provide descriptive commit messages (that are single line and follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard).
- Write self documenting code. Use descriptive variable and function names. Avoid unnecessary name shortening.
- Don't leave dead/commented out code behind. If you see such code, delete it.
<!-- - Write automated tests to cover critical integration points and functionality (once you learn how to do that). -->
