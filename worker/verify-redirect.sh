#!/bin/bash
# Script to verify the domain redirect is working

set -e

DOMAIN="dontforgetthisapp.com"
TARGET="thoughtmarksapp.com"

echo "Testing redirect from $DOMAIN to $TARGET..."
echo ""

# Test 1: Root path
echo "Test 1: Root path redirect"
RESPONSE=$(curl -sI "https://$DOMAIN" 2>&1)
if echo "$RESPONSE" | grep -q "HTTP/.* 301"; then
    LOCATION=$(echo "$RESPONSE" | grep -i "location:" | cut -d' ' -f2 | tr -d '\r')
    if echo "$LOCATION" | grep -q "$TARGET"; then
        echo "✅ SUCCESS: Root redirects to $LOCATION"
    else
        echo "❌ FAILED: Redirects to wrong location: $LOCATION"
        exit 1
    fi
else
    echo "❌ FAILED: Not a 301 redirect"
    echo "Response:"
    echo "$RESPONSE" | head -5
    exit 1
fi

echo ""

# Test 2: Path preservation
echo "Test 2: Path preservation"
TEST_PATH="/test-path"
RESPONSE=$(curl -sI "https://$DOMAIN$TEST_PATH" 2>&1)
if echo "$RESPONSE" | grep -q "HTTP/.* 301"; then
    LOCATION=$(echo "$RESPONSE" | grep -i "location:" | cut -d' ' -f2 | tr -d '\r')
    if echo "$LOCATION" | grep -q "$TARGET$TEST_PATH"; then
        echo "✅ SUCCESS: Path preserved: $LOCATION"
    else
        echo "❌ FAILED: Path not preserved. Expected: $TARGET$TEST_PATH, Got: $LOCATION"
        exit 1
    fi
else
    echo "❌ FAILED: Not a 301 redirect"
    exit 1
fi

echo ""

# Test 3: Query string preservation
echo "Test 3: Query string preservation"
TEST_QUERY="?test=value&another=param"
RESPONSE=$(curl -sI "https://$DOMAIN$TEST_QUERY" 2>&1)
if echo "$RESPONSE" | grep -q "HTTP/.* 301"; then
    LOCATION=$(echo "$RESPONSE" | grep -i "location:" | cut -d' ' -f2 | tr -d '\r')
    if echo "$LOCATION" | grep -q "$TARGET$TEST_QUERY"; then
        echo "✅ SUCCESS: Query string preserved: $LOCATION"
    else
        echo "❌ FAILED: Query string not preserved"
        exit 1
    fi
else
    echo "❌ FAILED: Not a 301 redirect"
    exit 1
fi

echo ""
echo "✅ ALL TESTS PASSED: Redirect is working correctly!"
echo ""
echo "You can also test in a browser:"
echo "  https://$DOMAIN"
echo "  Should redirect to: https://$TARGET"


