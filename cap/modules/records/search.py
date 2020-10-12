"""Configuration for record search."""

from elasticsearch_dsl import Q
from flask import g
from flask_login import current_user
from flask_principal import RoleNeed
from invenio_access.models import Role, ActionRoles
from invenio_search import RecordsSearch
from invenio_search.api import DefaultFilter

from cap.modules.access.permissions import admin_permission_factory
from cap.modules.access.utils import login_required


@login_required
def records_filter():
    """Filter list of deposits."""
    if admin_permission_factory(None).can():
        return Q()

    roles = [
        role.id for role in Role.query.all()
        if RoleNeed(role) in g.identity.provides
    ]

    # we need to get the schemas in order to access records that have
    # been given through cli permissions
    schemas = [
        result.argument for result in ActionRoles.query.filter(
            ActionRoles.action == 'record-schema-read',
            ActionRoles.role_id.in_(roles)).all()
    ]

    q = Q('multi_match', query=g.identity.id,
          fields=[
              '_access.record-read.users',
              '_access.record-admin.users'
          ]) | \
        Q('bool',
          should=[
              Q('query_string', query=f'{schema}-*', default_field='_type')
              for schema in schemas
          ]) | \
        Q('terms', **{'_access.record-read.roles': roles}) | \
        Q('terms', **{'_access.record-admin.roles': roles})

    return q


class CAPRecordSearch(RecordsSearch):
    """Default search class."""

    class Meta:
        """Configuration for records search."""

        index = 'records'
        doc_types = None
        fields = ('*',)
        facets = {}
        default_filter = DefaultFilter(records_filter)

    def get_user_records(self):
        """Get records that current user owns."""
        return self.filter(
            Q('multi_match', query=current_user.id, fields=['_deposit.owners'])
        )

    def sort_by_latest(self):
        """Sort by latest (updated)."""
        return self.sort(
            {'_updated': {'unmapped_type': 'date', 'order': 'desc'}}
        )
