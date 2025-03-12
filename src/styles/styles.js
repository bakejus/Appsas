import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e6f7ff', // Soft gradient background
    borderRadius: 20,  // Rounded corners for container
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0077b6', // Stylish title color
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Bold', // Use a bold font for title
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#0077b6', // Matching border color
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded corners for inputs
    fontSize: 16,
    fontFamily: 'HelveticaNeue', // Stylish font for inputs
    backgroundColor: '#fff', // Background color of input fields
    shadowColor: '#000', // Slight shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  button: {
    width: '100%',          // Full width
    height: 45,            // Adjust height
    backgroundColor: '#0095F6',  // Instagram blue
    borderRadius: 8,        // Less rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,      // Space before "OR"
    elevation: 2,          // Shadow on Android
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',        // White text
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#0077b6', // Matching link color
    fontWeight: '500',
    textDecorationLine: 'underline', // Underline for the "Forgot Password?" link
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 60, // Circular logo
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff', // Light blue background
  },
  statsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  statText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row', // Make text and button inline
    justifyContent: 'center',
    marginTop: 15,
  },
  signupText: {
    color: '#000', // Normal white text
    fontSize: 16,
  },
  signupLink: {
    color: '#007AFF', // iOS Blue (or use '#1E90FF' for Android)
    fontSize: 16,
  },
});

export default styles;
