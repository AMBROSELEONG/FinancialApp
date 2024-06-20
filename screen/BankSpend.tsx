import MainContainer from '../components/MainContainer';
import {useNavigation} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, walletIncomeCss} from '../objects/commonCss';
import {TextInput, HelperText, List} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';

const BankSpend = () => {
  const navigation = useNavigation();

  const theme = {
    roundness: 10, // Set the border radius here
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const [Total, setTotal] = useState('');
  const [TotalError, setTotalError] = useState('');

  const [selectedType, setSelectedType] = useState<string>('');

  const selectType = [
    {key: '1', value: 'Housing'},
    {key: '2', value: 'Transportation'},
    {key: '3', value: 'Food'},
    {key: '4', value: 'Entertainment'},
    {key: '5', value: 'Medical'},
    {key: '6', value: 'Education'},
    {key: '7', value: 'Clothing'},
    {key: '8', value: 'Insurance'},
    {key: '9', value: 'Save In Bank'},
    {key: '10', value: 'Other'},
  ];

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const formatDate = (date: any) => {
    return date.toISOString().substring(0, 10);
  };

  const [formattedDate, setFormattedDate] = useState(formatDate(new Date()));

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setFormattedDate(formatDate(currentDate));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  useEffect(() => {
    console.log(formattedDate);
  });

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor="#fff"
          barStyle={'dark-content'}
        />
        <View style={css.mainView}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons name="arrow-back" size={30} color={'#000'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={css.PageName}>SPEND</Text>
          </View>
        </View>
        <View style={walletIncomeCss.container}>
          <Text style={walletIncomeCss.title}>Fill in bank spend</Text>
          <Text style={walletIncomeCss.subtitle}>Current Balance</Text>
          <Text style={walletIncomeCss.balance}>RM 100</Text>
          <Text style={walletIncomeCss.label}>Total Spend</Text>
          <TextInput
            mode="outlined"
            style={walletIncomeCss.Input}
            placeholder="Please Enter Your Total Income"
            theme={theme}
            onChangeText={text => setTotal(text)}
          />
          {TotalError !== '' && (
            <HelperText type="error" style={walletIncomeCss.InputError}>
              {TotalError}
            </HelperText>
          )}

          <Text style={walletIncomeCss.label}>Spend Type</Text>
          <SelectList
            setSelected={(text: string) => setSelectedType(text)}
            data={selectType}
            save="value"
            boxStyles={walletIncomeCss.Input}
            inputStyles={{color: '#000'}}
            dropdownStyles={walletIncomeCss.Input}
            dropdownTextStyles={{color: '#000'}}
            search={false}
            placeholder={'Select the Income Source Type'}
          />

          <Text style={walletIncomeCss.label}>Date</Text>
          <TextInput
            mode="outlined"
            style={walletIncomeCss.Input}
            theme={theme}
            value={date.toDateString()}
            right={<TextInput.Icon icon="calendar" onPress={showDatepicker} />}
            editable={false}
          />
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}

          <TouchableOpacity style={walletIncomeCss.Button}>
            <Text style={walletIncomeCss.ButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default BankSpend;
