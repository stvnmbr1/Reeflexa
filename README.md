# Reeflexa

Creating an Alexa skill for reef-pi

Be able to ask alexa for latest stats from reef-pi equipment, in a later state be able to activate macros like feeding time, cleaning time, ...

I will start with the ability to retrieve stats first, in a later stage controlling macros/equipment and try to cover the entire API.

As of now the skill is hosted in an AWS Lambda instance, which requires amazon & AWS developer accounts(and CC credentials).
In a later stage I would like to host the Lambda instance on reef-pi to handle requests (easing end-user setup as no additional AWS lambda setup would be needed. 
API needs to be accessable through internet with a alexa hosted skill, Lambda instance needs to be accessable through internet with a local hosted Lambda instance.

No tutorial or guide available yet as these are the first baby steps.


Currently available capabilities:

Get/Return:
- Equipment Overview: 
- Outlet Overview:

Control:
- none


Additional context

Any input on what you would like Alexa to be able to do is welcome.
