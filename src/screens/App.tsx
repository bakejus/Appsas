/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//import React, { useEffect, useState } from 'react'; //Cia skirta importuot 2 funkcijas
import React, {} from 'react';
import type {PropsWithChildren} from 'react';
import { styles } from '../styles/appStyle'; // Importuojam stiliu

import {
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

//import { supabase } from '../services/supabase' // Importuojam Supabase

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

type ValueProps = {
    label: string,
    value: string,
    }
const StatValue = ({label, value}: ValueProps) => (
        <View style = {styles.valueContainer}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    )

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

    /*// State to hold Supabase data
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('USER').select('*');

            if (error) {
                console.error('❌ Error fetching data:', error);
            } else {
                console.log('✅ Supabase data:', data);
                setData(data);
            }
            setLoading(false);
        };

        fetchData();
    }, []);
    useEffect(() => {
        const addTestUser = async () => {
            const { data, error } = await supabase.from('USER').insert([
                { username: "JohnDoe", picture_url: "https://example.com/avatar.jpg" }
            ]);

            if (error) {
                console.error('❌ Error adding user:', error);
            } else {
                console.log('✅ Test user added:', data);
            }
        };

        addTestUser();  // Run once to add a user
    }, []);*/
  const safePadding = '5%';

  return (
    <View style={styles.container}>

        <View style={styles.statValue}>
            <StatValue label = 'steps' value='12345'/>
            <StatValue label = 'distance' value='10,2 km'/>
        <StatValue label = 'flights climbed' value='5'/>
        </View>

    {/*
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header/>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
              VEIKIA
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
      */}
    </View>
  );
}

export default App;
