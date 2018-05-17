Status Report
=============

.. note:: This page will be updated as development progresses. If you have any questions or something appears out of date please feel free to :doc:`contact us <../community/support>`.

.. note::
	During pre-release data will be stored and versioned. User experience can change over time, any feedback is welcome. Schema changes will be announced and will happen rarely to ensure stability.

Development wraps around the `three pillars <https://github.com/cernanalysispreservation/analysispreservation.cern.ch/wiki/Overview>`_ identified with the help of CERN physicists in the `5th CAP meeting <https://github.com/cernanalysispreservation/analysis-preservation.cern.ch/wiki/Fifth-CAP-meeting>`_:

- :ref:`status-describe`
- :ref:`status-capture`
- :ref:`status-reuse`

To this point these can roughly be translated to *what you see*, *the functionality that lies behind it* and *additional services*.


.. _status-describe:

Describe
--------

Experiment schemas are used to describe the most important features and data for an analysis. They will be accessible via web forms and an API. Thus, this pillar includes everything related to the *schemas*, *search*, *user interface* and *API*.

**Schema - work in progress**
	**ALICE - untestet**
		First version of schema exists. Waiting for feedback.
	**ATLAS - untested**
		Focus has been put on the workflow. A basic schema exists that will require testing and feedback.
	**CMS - iterative testing and development**
		Iterative testing has provided us with sufficient input to create a schema that covers basic analyses. More feedback is needed from groups that have further requirements.
		
		The CMS Questionnaire has been added and will undergo testing to ensure its quality.
	**LHCb - polishing state**
		Testing and refinement have let to an (almost) complete schema that will undergo full-functionality testing to ensure its quality.
**Search - being implemented**
	A dedicated search page is currently under development. We have gained some feedback pointing out interesting filters for adjusting the search to specific analysis information. More feedback is welcome.
**UI - in progress of updating**
	An update for the user interface is work in progress and will continue for some while. We will need testers to ensure the best user experience.
**API - basic version exists**
	A very basic version exists, future development will be driven by requirements named by physicists. This is one of the next tasks to come.


.. _status-capture:

Capture
-------

Autocompletion, suggestion of content and automatic filling in of information will be handled by this pillar as well as save storage of information and data.

.. todo::
	Add status update as soon as confirmed.

.. **ALICE - information required**
..	Pending, as no information has been provided yet.
.. **ATLAS - access to databases required**
..	Access to databases is not available to us yet, no connection possible.

..	- Glance - no access
..	- AMI - no access

.. **CMS - access lost, connections not established**
..	Access to databases was lost due to API changes, more information is required on what else is needed or can be captured.

..	- CADI - waiting for reimplementation
..	- DAS - reconnection is work in progress
..	- Trigger Information - TODO CMS Triggers are connected!?
..	- more - information required

.. **LHCb - mostly connected**
..	A connection to most databases is established.

..	- Bookkeeping (BK) - no connection yet, ...
..	- Working Groups (WG) - connected
..	- Publications - connected
..	- Anna's DB - connected

.. **Data upload - almost ready**
..	File upload works for local files and grabbing files from certain places (cds, TODO?). Error messages and retry on error will be implemented.

.. **Repository checkout - future work**
..	Checking out the required state of a repository that is linked to in the analysis information is important for preservation. It will be a future task.


.. _status-reuse:

Rerun
-----

Rerunning an analysis with REANA and without interfering in the way the analysis is done is possible right now. This pillar will provide the necessary wrap-around so you can rerun your analysis directly on CERN Analysis Preservation.

**ALICE - information required**
	Pending, as no information has been provided yet.
**ATLAS - examples refined for real analyses**
	Initiated by RECAST, a workflow schema exists and has already been refined for a real analysis. More examples are required.
**CMS - example workflow in development**
	Creating a first workflow schema for an analysis is currently work in progress.
**LHCb - examples exist for real analyses**
	A first workflow schema exists and has been developed for a real analysis. More examples are required.
