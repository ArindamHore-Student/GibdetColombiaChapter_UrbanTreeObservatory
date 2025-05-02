#!/bin/bash
set -e

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Always compile messages to ensure translations work
echo "Compiling translation messages..."
python manage.py compilemessages

# Collect static files if not in debug mode
if [ "$DEBUG" = "0" ]; then
    echo "Production mode detected (DEBUG=0)"
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
else
    echo "Development mode detected (DEBUG=$DEBUG)"
fi

# Start server
echo "Starting server..."
exec "$@"
