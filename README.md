# WorkFlow AI Assistant

Build a modern AI-powered workplace productivity application called "WorkFlow AI"

Create a polished, responsive SaaS-style web application called WorkFlow AI.

WorkFlow AI is a single integrated workplace productivity assistant designed to help students, interns, employees, administrators, and professionals automate common workplace tasks using AI.

The application must demonstrate:

Practical AI implementation

Strong prompt engineering

Real-world workplace problem solving

Responsible AI usage

Modern UI/UX design

IMPORTANT: This is ONE integrated application containing three connected AI-powered productivity features. Do not create three unrelated mini-applications.

The core workflow should be:

User Input → AI Processing → Structured Output → Human Review → Action

1. APPLICATION STRUCTURE

Create a professional responsive dashboard application with:

Left sidebar navigation on desktop

Collapsible navigation on mobile

Top navigation/header

Main content workspace

Responsive cards

Clear buttons

Loading states

Error states

Empty states

Professional SaaS styling

Sidebar navigation should contain:

Dashboard

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

History

Settings

The application should be responsive on:

Desktop

Laptop

Tablet

Mobile

2. DASHBOARD

Create a professional homepage for WorkFlow AI.

The dashboard should include a welcome section:

"Good day! What would you like to accomplish?"

Subtitle:

"Turn workplace information into clear communication, organized tasks, and actionable plans with AI."

Quick Actions

Create three prominent feature cards:

Smart Email Generator

Description:

"Create professional workplace emails in seconds with AI."

Button:

"Generate Email"

Meeting Notes Summarizer

Description:

"Turn meeting notes into clear summaries, decisions, and action items."

Button:

"Summarize Meeting"

AI Task Planner

Description:

"Prioritize tasks and create practical daily or weekly schedules."

Button:

"Plan Tasks"

Each card should navigate to its respective feature.

Productivity Overview

Create overview cards showing:

Emails Generated

Meetings Summarized

Tasks Planned

Use realistic demo values initially.

Recent Activity

Display recent AI activity such as:

Follow-up email to project team

Weekly project meeting

Complete project presentation

Prepare internship application

Each activity should display:

Activity type

Title

Date/time

Status

View action where appropriate

3. SMART EMAIL GENERATOR

Create a dedicated Smart Email Generator page.

The purpose is to help users create professional workplace emails.

Input section

Include:

Email purpose

Recipient/context

Key points to communicate

Desired tone

Desired length

Optional call to action

Tone options:

Formal

Professional

Friendly

Persuasive

Apologetic

Concise

Length options:

Short

Medium

Detailed

Primary button:

"Generate Email"

AI Output

Display the generated result in a professional editable output area.

Include:

Suggested Subject

A concise subject line.

Email Body

The complete professional email.

Allow the user to:

Edit the generated email

Copy the email

Regenerate

Clear

Save to history

EMAIL PROMPT ENGINEERING

Do NOT use a generic prompt.

Create a structured AI prompt containing:

Role

The AI acts as a professional workplace communication assistant.

Objective

Generate a clear, professional email based on the user's purpose and information.

Context

Include all information supplied by the user.

Tone

Follow the selected tone.

Length

Follow the selected length.

Constraints

The AI must:

Use only information supplied by the user.

Never invent names, dates, events, facts, or commitments.

Avoid unnecessary wording.

Maintain professional workplace communication.

Preserve the user's intended meaning.

Include a clear call to action when requested.

Output format

Return:

Subject

Email body

If essential information is missing, identify the missing information rather than inventing it.

4. MEETING NOTES SUMMARIZER

Create a dedicated Meeting Notes Summarizer page.

The purpose is to transform unstructured meeting notes into structured workplace information.

Input

Include:

Meeting title

Meeting date

Attendees

Meeting notes

Primary button:

"Summarize Meeting"

AI Output

Structure the result into:

Meeting Summary

Provide a concise overview of the meeting.

Key Decisions

List decisions explicitly identified in the notes.

Action Items

Display action items in a structured format containing:

Task

Responsible person

Deadline

Priority

Important Discussion Points

Summarize major topics discussed.

Unresolved Issues / Follow-ups

Identify topics that still require attention.

CRITICAL RESPONSIBLE AI REQUIREMENT

The Meeting Notes Summarizer must NOT invent information.

The AI must never fabricate:

Attendees

Decisions

Deadlines

Responsible people

Facts

If information is missing, display:

"Not specified"

or clearly identify what information is missing.

For example, if a meeting note says:

"Sarah will prepare the presentation by Friday."

The AI may identify:

Task: Prepare presentation
Responsible person: Sarah
Deadline: Friday

But if the notes do not identify who is responsible, the AI must not guess.

The AI should distinguish between:

Information explicitly stated in the notes

and

AI recommendations or interpretations

Allow users to:

Edit the summary

Copy

Regenerate

Save

5. AI TASK PLANNER / SCHEDULER

Create a dedicated AI Task Planner page.

The purpose is to help users prioritize workplace tasks and generate realistic daily or weekly schedules.

Input

Allow users to enter multiple tasks.

Each task should support:

Task description

Deadline

Importance

Urgency

Estimated duration

Optional dependencies

Also allow the user to specify:

Available working hours

IMPORTANT:

The user should NOT need to manually enter today's/current date.

The application must automatically obtain the actual current date from the user's system/browser when generating the plan.

Pass this automatically detected date to the AI as scheduling context.

Task Prioritization

The AI should prioritize tasks using:

Urgency

Importance

Deadline

Estimated effort

Dependencies

Output

Generate:

Priority Ranking

Rank tasks from highest to lowest priority.

Recommended Schedule

Generate a realistic daily or weekly schedule based on:

Automatically detected current date

User-provided deadlines

Estimated duration

Available working hours

Task dependencies

For example, if the current date is August 20, 2026 and a task deadline is August 22, 2026, the AI should schedule the task within the available working days between August 20 and August 22.

Task Breakdown

Break large tasks into smaller actionable steps where appropriate.

Prioritization Reasoning

Briefly explain why the highest-priority tasks were ranked first.

Do not provide excessively long reasoning.

TASK PLANNER RESPONSIBLE AI RULES

The AI must NOT invent:

Deadlines

Task durations

Working hours

Dependencies

Tasks

If essential information is missing, clearly state what is missing.

Do not schedule tasks in the past.

If a deadline has already passed, clearly flag it.

Do not claim that the AI-generated schedule is guaranteed to be optimal.

The schedule should be presented as an AI recommendation that the user can review and modify.

6. INTEGRATION BETWEEN FEATURES

The application should feel like ONE integrated productivity platform.

Where practical, connect the Meeting Notes Summarizer to the Task Planner.

For example:

Meeting notes:

"Sarah needs to prepare the presentation by Friday."

The Meeting Summarizer should extract:

Action Item: Prepare presentation
Responsible Person: Sarah
Deadline: Friday

Provide an option such as:

"Add Action Items to Task Planner"

When selected, the extracted action items should be transferred into the Task Planner where possible.

Do not create an unnecessarily complicated integration if it would compromise reliability.

Prioritize a reliable working application.

7. HISTORY

Create a History page.

Display previous AI activities including:

Emails

Meetings

Tasks

Each history item should contain:

Feature type

Title

Date/time

Short preview

View action

Delete action where appropriate

Use realistic demo data initially if persistent storage is not available.

8. SETTINGS

Create a simple Settings page containing:

Responsible AI

Explain that AI-generated content may contain errors or omissions and should be reviewed.

Privacy Guidance

Tell users not to enter confidential or sensitive workplace information.

Clear History

Provide an option to clear locally stored activity/history where supported.

Do not create unnecessary settings.

9. RESPONSIBLE AI DISCLAIMER

Include a visible but professional Responsible AI notice in the application.

Use wording similar to:

"AI-generated content may contain errors or omissions. Review and verify important information before using it for professional, academic, financial, legal, or other consequential decisions."

The application should reinforce:

Human review is required.

AI assists decision-making rather than replacing human judgment.

Users should avoid entering confidential or sensitive workplace information.

AI outputs should be verified before external use.

AI must not fabricate facts or information.

10. AI PROMPT ENGINEERING ARCHITECTURE

Create separate structured prompts for each feature.

Do NOT use one generic AI prompt.

Each prompt should contain:

Role

Objective

User context

Input data

Constraints

Responsible AI rules

Required output format

Quality-control instructions

Where practical, use structured JSON responses so that the frontend can reliably render information into cards, tables, and sections.

The AI should be instructed to:

Follow the requested output structure.

Avoid hallucinating information.

Identify missing information.

Preserve important user-provided details.

Clearly distinguish facts from recommendations.

Avoid unnecessary verbosity.

11. UI/UX DESIGN

Use a modern professional SaaS design.

The interface should be:

Clean

Modern

Professional

Minimal

Accessible

Spacious

Easy to navigate

Use:

Rounded cards

Subtle borders

Clear typography

Consistent spacing

Professional icons

Clear primary and secondary buttons

Strong visual hierarchy

Avoid:

Excessive animations

Excessive gradients

Visual clutter

Unnecessary decorative elements

The application should look like a real workplace productivity product, not a basic student project.

12. RESPONSIVE DESIGN

Ensure all pages work correctly on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Sidebar becomes collapsible

Cards stack vertically

Tables become responsive

Input fields remain usable

Buttons remain accessible

No horizontal scrolling

13. LOADING AND ERROR STATES

Every AI feature should have appropriate:

Loading state

Clearly communicate that the AI is processing the request.

Error state

If AI generation fails, show a clear error message.

Provide a retry option.

Empty state

When no information has been entered, provide helpful instructions.

Do not leave blank screens.

14. DEMO DATA

Include realistic demonstration data so the application looks complete when presented.

Example email:

"Request for Project Submission Extension"

Example meeting:

"Weekly Project Team Meeting"

Example tasks:

Complete project research

Prepare presentation

Review final report

Submit project

Clearly distinguish demo information from real user information where appropriate.

15. TECHNICAL QUALITY

Use:

Reusable components

Clean component structure

Maintainable code

Clear naming conventions

Responsive layouts

Error handling

Loading states

Empty states

Keep the AI/API logic separate from the UI logic where practical.

Do not introduce unnecessary dependencies.

Prioritize reliability and functionality over adding unnecessary features.

16. FINAL APPLICATION REQUIREMENTS

The completed application must contain exactly these three core AI-powered workplace features:

1. Smart Email Generator

Generates professional emails using user-defined purpose, context, tone and length.

2. Meeting Notes Summarizer

Transforms unstructured meeting notes into summaries, decisions, action items and deadlines while identifying missing information instead of guessing.

3. AI Task Planner / Scheduler

Prioritizes tasks and generates daily/weekly schedules using the automatically detected current date, deadlines, urgency, importance, estimated duration and dependencies.

The application must also include:

Dashboard

Sidebar navigation

Responsive design

Input sections

AI-generated output sections

Editable/reviewable outputs

Structured AI prompts

History

Settings

Responsible AI disclaimer

Professional UI/UX

17. MOST IMPORTANT DEVELOPMENT INSTRUCTION

Build this as one cohesive application called WorkFlow AI.

Do not create separate disconnected applications.

The user experience should communicate that WorkFlow AI helps transform:

Unstructured workplace information → AI analysis → Structured output → Human review → Action

Prioritize practical workplace usefulness.

Do not add the AI Research Assistant or general AI Chatbot because they are outside the core three-feature scope.

Do not add unnecessary functionality simply to make the application larger.

The goal is a polished, reliable, professional three-feature AI workplace productivity assistant.

Build the application with all of the above requirements.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sync-workflow-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6491d0c0-d8f4-4ca4-b1ec-333bcda7cbbb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
