# Contributing Guide

Welcome to Rendezvous! Here's a few things about our process to ensure you can contribution smoothly.


## Contributing Rules

We welcome all positive contributions! Whether it's fixing typos or adding features, if you see something that can be improved, we encourage you to share your ideas.

Please create an issue before working on anything, especially significant changes or new features, as it allows the team to discuss and give feedback, before you spend time working on something that might not fit the project. Also, please test your code and ensure it follows our conventions.


## Git Workflow

This project follows the [feature branch workflow](https://knowledge.kitchen/content/courses/agile-development-and-devops/conventions/#follow-a-feature-branch-workflow). This means you mustn't make changes directly in the master branch, but in a separate branch, and create a PR to merge them, which needs to be reviewed by another maintainer.

Overview:
1. Clone this repository.
1. Create a new branch.
1. Make your modifications (make sure to commit often, and write descriptive, single line commit messages)
1. Push your work.
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
- If someone doesn't respond within 3 days, we will try to reach out to them as best we can (including potentially over other channels). If there is still no response after a week, the professor or graders are alerted.
- If someone fails to complete their work in time for a sprint, we will allow that to be pushed over to the next sprint once (if this option is possible). In case the work still isn't complete, the professor or graders are alerted.

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

TBD at the beginning of the next sprint (as there was no coding yet).

<!--
- Editor: VS Code
- Linting: Eslint
- Formatting: Prettier (and/or Stylistic?)
- Pre commit hook to ensure single line commit messages, and no commits to master.
- POSIX compatible shell (Windows needs WSL).
- Code must be peer-reviewed and pass tests before merging into the main branch of code.
- Always push working code, if you break the pipeline/build then fix it.
- Make granular and small commits, per feature or per bug fix.
- Provide descriptive commit messages.
- Write self documenting code. Use descriptive variable and function names. Avoid unnecessary name shortening.
- Don't leave dead/commented out code behind. If you see such code, delete it.
- Write automated tests to cover critical integration points and functionality (once you learn how to do that).
-->

<!-- 
## Setting up local development environment
## Building and testing the project
-->