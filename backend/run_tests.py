#!/usr/bin/env python
"""
Comprehensive test runner for the e-commerce application
"""
import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')
    django.setup()
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    
    print("="*60)
    print("Running E-commerce Application Test Suite")
    print("="*60)
    
    # Run all tests
    failures = test_runner.run_tests([
        "tests.unit",
        "tests.integration", 
        "tests.api",
        "tests.security",
        "tests.performance"
    ])
    
    if failures:
        print(f"\n❌ {failures} test(s) failed")
        sys.exit(1)
    else:
        print("\n✅ All tests passed!")
        sys.exit(0) 