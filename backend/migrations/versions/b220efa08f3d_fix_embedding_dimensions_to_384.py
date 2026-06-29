"""fix embedding dimensions to 384

Revision ID: b220efa08f3d
Revises: bdded77144aa
Create Date: 2026-06-29 10:53:30.411067

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = 'b220efa08f3d'
down_revision: Union[str, Sequence[str], None] = 'bdded77144aa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('knowledge_chunks', 'embedding',
               existing_type=Vector(1536),
               type_=Vector(384),
               existing_nullable=True)


def downgrade() -> None:
    op.alter_column('knowledge_chunks', 'embedding',
               existing_type=Vector(384),  #changed from 1536 to 384
               type_=Vector(1536),
               existing_nullable=True)