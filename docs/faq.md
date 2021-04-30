# Frequently Asked Questions

Here you can see the answers to some frequently asked questions:

## Why should I use CERN Analysis Preservation?

We believe that your research is worth preserving. CAP is there to support you in making sure that the work and thoughts you have put into your analysis last beyond the publications. By using CAP, you are able to safeguard your analysis resources (data, code, containers, etc.) and move on to the next project.

In addition, you can easily search through other submitted analyses that you find interesting. With the REANA project, you will also be able to directly rerun these analyses. We know it is hard to fully document physics analyses, so we try to make it as easy as possible for you to submit and update content.


## How do you define an "analysis"?

A physics analysis usually comprises numerous files, from data, code, workflows, containers to various configuration files. Also, often there is a lot of contextual information ("meta-information") that went into the analysis, which is essential for understanding the analysis in the future. From our point of view, an analysis is a combination of data and metadata. However, it should be noted that we use the term "data" very loosely. While every analysis is different, many core components are the same, which is apparent in the JSON schemas we provide. For more details, please see the [introduction](./what.md#analysis-definition).


## Is the information or data I add openly accessible?

No. You assign access permissions to your analysis. Access can be restricted to your collaboration or according to your preferences (see the section on [Authorisation and Access Control](./access.md) for more details). Nothing is by default openly available on CERN Analysis Preservation (except for the project's own source code). It is designed to be a safe environment for CERN physicists to use from the very beginning of starting their analysis and at any given moment in its lifetime.

If you are searching for a service for publishing your data, software or other materials openly, you can check out the [CERN Open Data portal](http://opendata.cern.ch/).


## I can edit, but can my collaborators edit my analysis too?

This depends on what permissions you assign to your collaborators. All your collaboration colleagues should be able to read it (read-only access), but only those you invite specifically (by email or e-group) can edit as well.


## Are you trying to automate all analyses?

No. Physics analyses are incredibly complex research work, which is precisely the reason why they are invaluable for preservation. What we are trying to do is help you with repetitive tasks, like finding the information you need, and support your review and approval process so that you can focus on the actual research.


## Do I have to use this rather long form or what other options do I have?

You can use your shell and our "CAP-client" to submit, update or find an analysis. That way, you can entirely circumvent the long submission form. Also, by using collaborative tools like GitLab, submitting your analysis becomes much more comfortable. You can automatically connect your repository to CAP and preserve different versions of the code. For information on how to use the CAP client, please consult the client's documentation: https://analysispreservation.cern.ch/docs/cli/


## What is the analysis PID?

We use a unique and persistent ID for your analysis to distinguish it from the other analyses available on CAP. You can use it to update your analysis or find information about it via the CAP client. Once you submit your analysis, you will see the ID in the URL of your analysis page on CAP.


## As a database provider within a CERN collaboration, how can I contribute to or profit from CAP?

Please contact us at analysis-preservation-support@cern.ch to find out more about our current efforts.
