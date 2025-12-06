# Drive Capital Software Engineer Code Sample

We're excited to continue the interview process with you! For a next step, we're asking you to write some code. Before we get into the requirements, please read the following guidelines :arrow_down:

- We want to be respectful of your time, so spend as much time as makes sense for you. Spending any less or more time is not an indication of the quality of the solution.
- If you get stuck and aren't able to finish:
  - We still want to see your submission! The goal is to have some of your work to talk about in the interview.
  - Please submit your work and explain in the README what felt challenging and how you tried to solve the problem.
  - It's more important for us to learn how you approach problem solving than to receive a "perfect" submission.
- Please pick the programming language with which you feel more comfortable.
  - Do not pick a language in our tech stack just because we use it.
- Even though this is a toy problem, we want to see how you build quality software, so consider design tradeoffs as you would for a product rather than a one-off tool.
- If something comes up and you just need a bit more time, please don't hesitate to let us know. Life happens, we get it.

Keeping the above in mind, here are the program requirements:

The team at Drive uses Herbie, our internal software, to build and analyze our interpersonal network. Herbie works diligently to discover information about the people we're talking to and the companies at which those people work. We can use Herbie to answer questions like:

- Who do we know who works at ACME Co?
- Who is the person we know best at ACME Co?
- Who at Drive can introduce me to the CFO of ACME Co?

To answer these questions, we can analyze people in our network and the relationships between those people. The code sample we're asking you to solve is an abbreviated version of this problem set. At a high level, the code sample will ingest a file which contains everything Herbie knows about Drive's network and provide some insights into that network. Please see the list of requirements below :arrow_down:

- Write a program that processes a list of commands. Each line of input will be one command. There are four types of commands, each consisting of space-separated words. A word consists of the upper- and lowercase characters A thru z.
  - `Partner <Name>`
    - This declares the existence of a Partner. A partner is an employee of a company named "Drive Capital".
  - `Company <Name>`
    - This declares the existence of a Company that isn't Drive Capital.
  - `Employee <Name> <CompanyName>`
    - This declares the existence of an Employee that works at a previously declared company.
    - To make the problem simpler, you can assume that when an employee is declared, the company referenced will be previously declared in the input.
    - Employee names are globally unique i.e. There cannot be a Sarah that works at Hooli and ACME.
  - `Contact <EmployeeName> <PartnerName> <ContactType: [email|call|coffee]>`
    - This declares an instance of "contact" between a member of Drive Capital and an employee of company.
    - We use contacts to figure out who at Drive has communicated with people at different companies.
    - The program should only accept the contact types `email`, `call`, or `coffee`.
    - Example: `Contact Ollie Masha call` means that Masha, an employee of Drive, spoke on the phone with Ollie.
- You may assume the input is well-formed (i.e. no incorrectly formatted lines).
  - Add as much or as little error handling as you feel is appropriate.
- The program must be executable via the command line. You can choose whether to accept input via a file name, STDIN, or both, as long as you tell us how to run it :arrow_down:
  - File Name: `ruby analyze_network.rb input.txt`
  - STDIN: `cat input.txt | ruby analyze_network.rb`
    - STDIN is more relevant on macOS / Linux. We suggest ignoring this option if you are using a different OS.
- The program must print its output to the console.
- The output of the program is a list of all companies, sorted alphabetically. Each company should also list the Partner with the strongest relationship to it and the partner's relationship strength to that company.
  - A partner's relationship to a company is defined as the total amount of contacts between a partner and all employees of the company
- Each line of the output should be structured as the following:
  - `<CompanyName>: <PartnerName> (<RelationshipStrength>)`
  - If we have no relationship to a company, the line should be: `<CompanyName>: No current relationship`.
- Along with your solution, please include a README. The README should have:
  - Instructions on how to build, run, and test your submission.
  - A brief explanation of how you approached the problem and any design decisions made.
  - Any assumptions your code makes about the input data or any possible edge cases you may discover.
    - If an instruction is unclear, please reach out or document in the README your interpretation of the discrepancy.

Putting all that together, here's an example input and expected output :arrow_down:

```
# input.txt - NOTE: There will not be a comment in the actual input, this is simply for demonstration purposes
Partner Chris
Partner Molly
Company Globex
Company ACME
Employee Laurie Globex
Company Hooli
Employee Abdi Hooli
Employee Jamie Globex
Contact Laurie Chris email
Contact Laurie Molly call
Partner Rezzan
Contact Abdi Molly email
Contact Laurie Chris coffee
```

Let's say the solution was written with ruby. We'd expected it to work like :arrow_down:

```bash
$ ruby analyze_network.rb input.txt
ACME: No current relationship
Globex: Chris (2)
Hooli: Molly (1)
```
