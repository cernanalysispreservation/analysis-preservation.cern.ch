..  This file is part of Invenio
    Copyright (C) 2014 CERN.

    Invenio is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation; either version 2 of the
    License, or (at your option) any later version.

    Invenio is distributed in the hope that it will be useful, but
    WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Invenio; if not, write to the Free Software Foundation, Inc.,
    59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.

Detailed installation guide
===========================

Docker installation
-------------------

You should have installed Docker and docker-compose on your machine. Then, you
can build the application using the development configuration:

.. code-block:: shell

   docker-compose -f docker-compose-dev.yml build


Now that you have built the application inside the docker containers, you will
need to initialize some modules. This initialization consist of the creation of
the tables inside the database, the default user (user:
info@inveniosoftware.org, password: infoinfo), the required communities and the
ElasticSearch index.

To initialise it then, you will need to perform:

.. code-block:: shell

   docker-compose run app bash scripts/init.sh


Optionally, if you want to populate the database with some example records, you
can run:

.. code-block:: shell

   docker-compose run app cap fixtures records -f


And lately, you can start the application:

.. code-block:: shell

   docker-compose -f docker-compose-dev.yml up


Now, open your browser and navigate to http://localhost/


Bare installation
-----------------

.. admonition:: CAVEAT LECTOR

   Invenio v3.0 alpha is a bleeding-edge developer preview version that is
   scheduled for public release in Q1/2016.

Prerequisites
^^^^^^^^^^^^^

Invenio v3.0 needs several prerequisite software packages to function:

- `Elasticsearch <https://www.elastic.co/products/elasticsearch>`_
- `PostgreSQL <http://www.postgresql.org/>`_
- `RabbitMQ <http://www.rabbitmq.com/>`_
- `Redis <http://redis.io/>`_

For example, on Debian GNU/Linux, you can install them as follows:

.. code-block:: shell

   sudo apt-get install elasticsearch \
                        postgresql \
                        rabbitmq-server \
                        redis-server

and do a system install for the Sass preprocessor by following `Sass web guide <http://sass-lang.com/install>`_ and running:

.. code-block:: shell

  sudo npm install -g sass node-sass clean-css uglify-js requirejs


Installation
^^^^^^^^^^^^

Let's start by creating a new virtual environment that will hold our CAP
v3.0 instance:

.. code-block:: shell

   mkvirtualenv cap

Start redis server in the background:

.. code-block:: shell

   redis-server &

Install CAP package:

.. code-block:: shell

   cdvirtualenv
   mkdir src && cd src
   git clone https://github.com/cernanalysispreservation/analysis-preservation.cern.ch.git cap
   cd cap
   pip install -r requirements.txt

Add the following lines in your "elasticsearch.yml":

.. code-block:: shell

  # MY CONFIGS

  cluster.name: cap
  discovery.zen.ping.multicast.enabled: false
  http.port: 9200
  http.publish_port: 9200

Run npm to install any necessary JavaScript assets the Invenio modules
depend on:

.. code-block:: shell

   cd cap
   cap npm
   cdvirtualenv var/cap-instance/static
   npm install bower
   npm install

   cdvirtualenv src/cap
   cap collect -v
   cap assets build
   python ./scripts/schemas.py

Create database to hold persistent data:

.. code-block:: shell

   cap db init
   cap db create

Create a user account:

.. code-block:: shell

   cap users create info@inveniosoftware.org -a

Create some basic collections:

.. code-block:: shell

   cap collections create CERNAnalysisPreservation
   cap collections create CMS -p CERNAnalysisPreservation
   cap collections create CMSQuestionnaire -p CMS -q '_type:cmsquestionnaire'
   cap collections create CMSAnalysis -p CMS -q '_type:cmsanalysis'
   cap collections create LHCb -p CERNAnalysisPreservation
   cap collections create LHCbAnalysis -p LHCb -q '_type:lhcbanalysis'
   cap collections create ATLAS -p CERNAnalysisPreservation
   cap collections create ATLASWorkflows -p ATLAS -q '_type:atlasworkflows'
   cap collections create ATLASAnalysis -p ATLAS -q '_type:atlasanalysis'
   cap collections create ALICE -p CERNAnalysisPreservation

Start Elasticsearch in the background:

.. code-block:: shell

   elasticsearch &

Create the index in ElasticSearch using the mappings:

.. code-block:: shell

   cap index init

Start the web application (in debugging mode):

.. code-block:: shell

   cap --debug run


Now we can create our first record by going to ``http://localhost:5000/records/<collection_name>/create/``

  ex. ``http://localhost:5000/records/CMS/create/`` which creates the record and takes you to the record page

Populating The Database With Example Records
""""""""""""""""""""""""""""""""""""""""""""
If you want to populate the database with example records you can run:

.. code-block:: shell

   # For creating demo records with schema validation
   cap fixtures records

   # For creating demo records without validation ( --force )
   cap fixtures records -f

General Recommendations
"""""""""""""""""""""""

You can specify the python version for the virtual environment by running (e.g. to use python 2.7):

.. code-block:: shell

   mkvirtualenv -p /usr/bin/python2.7 cap


Troubleshooting
^^^^^^^^^^^^^^^

Missing Requirements
""""""""""""""""""""
If you have trouble with the setup check if you are missing one of the following requirements:

.. code-block:: shell

   nodejs npm ruby gcc python2 python2-pysqlite python-virtualenvwrapper python2-lxml python2-pip

The version of python2 given by ``python2 --version`` should be greater than 2.7.10.

Errors with npm start and Alpaca
""""""""""""""""""""""""""""""""
If ``npm start`` fails for alpaca, you can try:

.. code-block:: shell

   npm install gulp gulp-clean jshint gulp-jshint
   npm install
   npm start   

Database Indexing Problems
""""""""""""""""""""""""""
If you have trouble indexing the database try:

.. code-block:: shell

   cap db destroy
   cap db init

and if that does not work try:

.. code-block:: shell

   curl -XDELETE 'http://localhost:9200/rec*'
   curl -XDELETE 'http://localhost:9200/map*'
   cap db init
