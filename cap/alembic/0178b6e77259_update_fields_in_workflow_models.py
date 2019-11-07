#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Update fields in workflow models"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0178b6e77259'
down_revision = 'a85d38b8e3e9'
branch_labels = ()
depends_on = None


def upgrade():
    """Upgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('reana_workflows', sa.Column('timestamp', sa.DateTime(), nullable=False))
    op.add_column('reana_workflows', sa.Column('user_id', sa.Integer(), nullable=False))
    op.alter_column('reana_workflows',
                    sa.Column('status',
                              sa.Enum('created', 'queued', 'running', 'stopped',
                                      'failed', 'deleted', name='status'),
                              nullable=False))
    op.drop_constraint(u'fk_reana_workflows_cap_user_id_accounts_user', 'reana_workflows', type_='foreignkey')
    op.create_foreign_key(op.f('fk_reana_workflows_user_id_accounts_user'), 'reana_workflows', 'accounts_user', ['user_id'], ['id'])
    op.drop_column('reana_workflows', 'cap_user_id')
    op.drop_column('reana_workflows', 'status')
    op.create_unique_constraint(op.f('uq_status_checks_id'), 'status_checks', ['id'])
    # ### end Alembic commands ###


def downgrade():
    """Downgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(op.f('uq_status_checks_id'), 'status_checks', type_='unique')
    op.add_column('reana_workflows', sa.Column('cap_user_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_constraint(op.f('fk_reana_workflows_user_id_accounts_user'), 'reana_workflows', type_='foreignkey')
    op.create_foreign_key(u'fk_reana_workflows_cap_user_id_accounts_user', 'reana_workflows', 'accounts_user', ['cap_user_id'], ['id'])
    op.drop_column('reana_workflows', 'user_id')
    op.drop_column('reana_workflows', 'timestamp')
    op.alter_column('reana_workflows', sa.Column('status',
                                                 sa.String(100),
                                                 nullable=False))
    # ### end Alembic commands ###