#!/bin/bash

# =====================================================
# BimaBuddy Advanced - Database Setup Script
# =====================================================
# This script executes all database migrations in order
# Usage: ./setup_database.sh [connection_string]
#
# Example:
# ./setup_database.sh "postgresql://postgres:password@db.project.supabase.co:5432/postgres"
# =====================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if connection string is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Database connection string required${NC}"
    echo ""
    echo "Usage: $0 [connection_string]"
    echo ""
    echo "Example:"
    echo "  $0 \"postgresql://postgres:password@db.project.supabase.co:5432/postgres\""
    echo ""
    echo "Or set DATABASE_URL environment variable:"
    echo "  export DATABASE_URL=\"postgresql://postgres:password@db.project.supabase.co:5432/postgres\""
    echo "  $0"
    exit 1
fi

# Connection string
if [ -n "$1" ]; then
    DATABASE_URL="$1"
elif [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: No database connection string provided${NC}"
    exit 1
fi

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   BimaBuddy Advanced Database Setup           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MIGRATIONS_DIR="$SCRIPT_DIR/migrations"

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo -e "${RED}Error: Migrations directory not found: $MIGRATIONS_DIR${NC}"
    exit 1
fi

# List of migration files in order
MIGRATIONS=(
    "001_core_tables.sql"
    "002_wellness_integration.sql"
    "003_claim_intelligence.sql"
    "004_voice_assistant.sql"
    "005_views_and_functions.sql"
)

# Function to execute a migration
execute_migration() {
    local migration_file=$1
    local migration_path="$MIGRATIONS_DIR/$migration_file"

    if [ ! -f "$migration_path" ]; then
        echo -e "${RED}✗ Migration file not found: $migration_file${NC}"
        return 1
    fi

    echo -e "${YELLOW}▸ Executing: $migration_file${NC}"

    if psql "$DATABASE_URL" -f "$migration_path" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Success: $migration_file${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed: $migration_file${NC}"
        echo ""
        echo "Running with verbose output to show error:"
        psql "$DATABASE_URL" -f "$migration_path"
        return 1
    fi
}

# Test database connection
echo -e "${BLUE}Testing database connection...${NC}"
if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
    echo ""
else
    echo -e "${RED}✗ Database connection failed${NC}"
    echo ""
    echo "Please check your connection string and try again."
    exit 1
fi

# Execute all migrations
echo -e "${BLUE}Running migrations...${NC}"
echo ""

migration_count=0
success_count=0
failed_count=0

for migration in "${MIGRATIONS[@]}"; do
    ((migration_count++))
    echo -e "${BLUE}[$migration_count/${#MIGRATIONS[@]}]${NC}"

    if execute_migration "$migration"; then
        ((success_count++))
    else
        ((failed_count++))
        echo ""
        echo -e "${RED}Migration failed. Stopping execution.${NC}"
        break
    fi

    echo ""
done

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Migration Summary                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Total migrations: $migration_count"
echo -e "${GREEN}Successful: $success_count${NC}"
if [ $failed_count -gt 0 ]; then
    echo -e "${RED}Failed: $failed_count${NC}"
else
    echo -e "Failed: $failed_count"
fi
echo ""

# Verification
if [ $failed_count -eq 0 ]; then
    echo -e "${BLUE}Verifying database setup...${NC}"
    echo ""

    # Count tables
    table_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'" | tr -d ' ')
    echo -e "Tables created: ${GREEN}$table_count${NC}"

    # Count views
    view_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public'" | tr -d ' ')
    echo -e "Views created: ${GREEN}$view_count${NC}"

    # Count functions
    function_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public'" | tr -d ' ')
    echo -e "Functions created: ${GREEN}$function_count${NC}"

    echo ""
    echo -e "${GREEN}✓ Database setup completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Configure Row-Level Security (RLS) policies in Supabase Dashboard"
    echo "2. Add sample data if needed"
    echo "3. Update your .env.local file with database credentials"
    echo "4. Test the connection from your Next.js application"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Database setup failed${NC}"
    echo ""
    echo "Please check the error messages above and try again."
    echo "You may need to rollback changes and re-run the script."
    echo ""
    exit 1
fi
