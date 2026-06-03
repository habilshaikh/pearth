import requests
import sys
import json
from datetime import datetime

class SAITechAPITester:
    def __init__(self, base_url="https://sai-tech-cnc.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test API health endpoint"""
        return self.run_test("API Health Check", "GET", "", 200)

    def test_home_content(self):
        """Test home content endpoint"""
        return self.run_test("Get Home Content", "GET", "home", 200)

    def test_products_list(self):
        """Test products list endpoint"""
        return self.run_test("Get Products List", "GET", "products", 200)

    def test_services_list(self):
        """Test services list endpoint"""
        return self.run_test("Get Services List", "GET", "services", 200)

    def test_machines_list(self):
        """Test machines list endpoint"""
        return self.run_test("Get Machines List", "GET", "machines", 200)

    def test_client_logos(self):
        """Test client logos endpoint"""
        return self.run_test("Get Client Logos", "GET", "client-logos", 200)

    def test_contact_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "phone": "+91 98765 43210",
            "subject": "Test Message",
            "message": "This is a test message from automated testing."
        }
        return self.run_test("Submit Contact Form", "POST", "contact", 201, contact_data)

    def test_admin_login(self):
        """Test admin login and get token"""
        login_data = {
            "email": "admin@saitech.com",
            "password": "Admin@123"
        }
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, login_data)
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_verify_token(self):
        """Test token verification"""
        if not self.token:
            print("❌ No token available for verification")
            return False
        return self.run_test("Verify Admin Token", "GET", "auth/verify", 200)

    def test_admin_get_messages(self):
        """Test getting contact messages (admin only)"""
        if not self.token:
            print("❌ No token available for admin endpoints")
            return False
        return self.run_test("Get Contact Messages (Admin)", "GET", "contact", 200)

    def test_admin_update_home(self):
        """Test updating home content (admin only)"""
        if not self.token:
            print("❌ No token available for admin endpoints")
            return False
        
        update_data = {
            "hero_title": "Test Updated Title",
            "cta_text": "Test CTA Updated"
        }
        return self.run_test("Update Home Content (Admin)", "PUT", "home", 200, update_data)

    def test_admin_create_product(self):
        """Test creating a product (admin only)"""
        if not self.token:
            print("❌ No token available for admin endpoints")
            return False
        
        product_data = {
            "name": f"Test Product {datetime.now().strftime('%H%M%S')}",
            "description": "This is a test product created by automated testing.",
            "specs": "Test specifications",
            "applications": "Test applications",
            "quality_note": "Test quality note",
            "images": ["https://images.unsplash.com/photo-1531053326607-9d349096d887?w=400"]
        }
        success, response = self.run_test("Create Product (Admin)", "POST", "products", 201, product_data)
        if success and 'id' in response:
            self.test_product_id = response['id']
            return True
        return False

    def test_admin_create_service(self):
        """Test creating a service (admin only)"""
        if not self.token:
            print("❌ No token available for admin endpoints")
            return False
        
        service_data = {
            "name": f"Test Service {datetime.now().strftime('%H%M%S')}",
            "description": "This is a test service created by automated testing.",
            "image_url": "https://images.pexels.com/photos/8973680/pexels-photo-8973680.jpeg?w=400"
        }
        success, response = self.run_test("Create Service (Admin)", "POST", "services", 201, service_data)
        if success and 'id' in response:
            self.test_service_id = response['id']
            return True
        return False

    def test_admin_create_machine(self):
        """Test creating a machine (admin only)"""
        if not self.token:
            print("❌ No token available for admin endpoints")
            return False
        
        machine_data = {
            "name": f"Test Machine {datetime.now().strftime('%H%M%S')}",
            "capacity": "Test capacity specifications",
            "specs": "Test machine specifications",
            "image_url": "https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=400"
        }
        success, response = self.run_test("Create Machine (Admin)", "POST", "machines", 201, machine_data)
        if success and 'id' in response:
            self.test_machine_id = response['id']
            return True
        return False

    def test_seed_database(self):
        """Test database seeding endpoint"""
        return self.run_test("Seed Database", "POST", "seed", 200)

def main():
    print("🚀 Starting SAI TECH API Testing...")
    print("=" * 60)
    
    tester = SAITechAPITester()
    
    # Test public endpoints first
    print("\n📋 TESTING PUBLIC ENDPOINTS")
    print("-" * 40)
    
    tester.test_health_check()
    tester.test_seed_database()  # Ensure data exists
    tester.test_home_content()
    tester.test_products_list()
    tester.test_services_list()
    tester.test_machines_list()
    tester.test_client_logos()
    tester.test_contact_submission()
    
    # Test admin authentication
    print("\n🔐 TESTING ADMIN AUTHENTICATION")
    print("-" * 40)
    
    if not tester.test_admin_login():
        print("❌ Admin login failed, skipping admin tests")
        print_results(tester)
        return 1
    
    tester.test_admin_verify_token()
    
    # Test admin endpoints
    print("\n👨‍💼 TESTING ADMIN ENDPOINTS")
    print("-" * 40)
    
    tester.test_admin_get_messages()
    tester.test_admin_update_home()
    tester.test_admin_create_product()
    tester.test_admin_create_service()
    tester.test_admin_create_machine()
    
    # Print final results
    print_results(tester)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

def print_results(tester):
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {tester.tests_run}")
    print(f"Passed: {tester.tests_passed}")
    print(f"Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for i, failure in enumerate(tester.failed_tests, 1):
            print(f"{i}. {failure['test']}")
            if 'expected' in failure:
                print(f"   Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"   Response: {failure['response']}")
            if 'error' in failure:
                print(f"   Error: {failure['error']}")
    else:
        print("\n✅ All tests passed!")

if __name__ == "__main__":
    sys.exit(main())