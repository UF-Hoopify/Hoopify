import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// @ts-ignore
import courtBg from "../../assets/images/court-bg.jpg";

export default function LandingScreen({ navigation }: any) {
  
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ImageBackground 
        source={courtBg} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.contentContainer}>
            
            {/* Top Logo Section */}
            <View style={styles.logoContainer}>
              <Ionicons name="basketball-outline" size={32} color="white" />
              <Text style={styles.logoText}>Hoopify</Text>
            </View>

            {/* Middle Text Section (Now Centered) */}
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>Connect.</Text>
              <Text style={styles.heroTitle}>Play.</Text>
              <Text style={styles.heroTitle}>Dominate.</Text>
              <Text style={styles.heroSubtitle}>
                The ultimate network for recreational ballers.
              </Text>
            </View>

            {/* Bottom Button Section */}
            <View style={styles.buttonSection}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={handleSignUp}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.outlineButton} 
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineButtonText}>Log In</Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>EST. 2026</Text>
            </View>

          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 1,
  },
  
  // --- UPDATED CENTERED TEXT STYLES ---
  heroSection: {
    marginTop: 60,
    alignItems: 'center', // Centers the text block horizontally
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 52,
    letterSpacing: -1,
    textAlign: 'center', // Centers the text itself
  },
  heroSubtitle: {
    color: '#E0E0E0',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
    maxWidth: '80%',
    textAlign: 'center', // Centers the subtitle
  },

  buttonSection: { width: '100%', marginBottom: 20, gap: 16 },
  primaryButton: {
    backgroundColor: '#F97316',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  outlineButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  footerText: {
    color: '#AAA',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
});