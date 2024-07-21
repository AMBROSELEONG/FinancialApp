import {DefaultTheme, Modal, Title} from 'react-native-paper';
import {Dimensions, StyleSheet} from 'react-native';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000',
  },
};

export default darkTheme;

export const darkWelcome = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
});

export const darkSignIn = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column',
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginTop: '10%',
  },
  Content: {
    fontSize: 16,
    marginTop: '5%',
    textAlign: 'center',
    color: '#fff',
  },
  Input: {
    marginTop: '5%',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#000',
  },
  LoginButton: {
    width: '80%',
    backgroundColor: '#3490DE',
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  Or: {
    fontSize: 12,
    color: '#8B8B8B',
    marginHorizontal: 10,
  },
  SignUp: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 10,
  },
});

export const darkVerify = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#000',
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  ModalContainer: {
    width: '60%',
    height: Dimensions.get('screen').width / 1.4,
    backgroundColor: '#000',
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  TextModal: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
});

export const darkCss = StyleSheet.create({
  mainView: {
    width: '100%',
    height: (Dimensions.get('screen').height / 100) * 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  PageName: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export const darkCustom = StyleSheet.create({
  header: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: (Dimensions.get('screen').height / 100) * 8,
    marginRight: 20,
  },
});

export const darkHome = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  welcome: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: (Dimensions.get('screen').width / 100) * 6,
  },
  dateContainer: {
    width: (Dimensions.get('screen').width / 100) * 60,
    height: (Dimensions.get('screen').width / 100) * 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    backgroundColor: '#202020',
    alignSelf: 'center',
    marginTop: 20,
  },
  date: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: (Dimensions.get('screen').width / 100) * 10,
    fontWeight: 'bold',
  },
  spendContainer: {
    width: (Dimensions.get('screen').width / 100) * 95,
    height: (Dimensions.get('screen').width / 100) * 90,
    backgroundColor: '#202020',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    alignSelf: 'center',
    marginTop: 20,
    padding: 5,
  },
  spend: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  xAxisLabel: {
    color: '#fff',
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export const darkSetting = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#000000',
  },
  UserContainer: {
    width: '100%',
    height: (Dimensions.get('screen').width / 100) * 25,
    backgroundColor: '#202020',
    flexDirection: 'row',
  },
  EditContainer: {
    width: '100%',
    height: (Dimensions.get('screen').width / 100) * 20,
    backgroundColor: '#202020',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PrefenceContainer: {
    width: '100%',
    height: (Dimensions.get('screen').height / 100) * 50,
    backgroundColor: '#202020',
    marginTop: 30,
  },
  UserName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  Email: {
    color: '#cccccc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  PrefenceText: {
    color: '#fff',
    fontWeight: 'bold',
    margin: 20,
    fontSize: 16,
  },
});

export const darkLanguage = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    alignSelf: 'center',
  },
});

export const darkUserEdit = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#202020',
    position: 'relative',
  },
  header: {
    backgroundColor: '#000',
    height: (Dimensions.get('screen').height / 100) * 13,
  },
  imageContainer: {
    width: (Dimensions.get('screen').width / 100) * 28,
    height: (Dimensions.get('screen').width / 100) * 28,
    backgroundColor: '#202020',
    borderRadius: Dimensions.get('screen').width * 100,
    position: 'absolute',
    alignSelf: 'center',
    top: (Dimensions.get('screen').height / 100) * 6,
  },
  Title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: (Dimensions.get('screen').height / 100) * 5,
    marginLeft: (Dimensions.get('screen').width / 100) * 5,
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    marginTop: (Dimensions.get('screen').height / 100) * 1,
    backgroundColor: '#000',
  },
});

export const darkWallet = StyleSheet.create({
  header: {
    backgroundColor: '#000',
    flex: 1,
    width: '100%',
  },
  body: {
    flex: 3,
    backgroundColor: '#202020',
    paddingHorizontal: 10,
    paddingTop: (Dimensions.get('screen').height / 100) * 6,
    zIndex: -1,
  },
  positionContainer: {
    width: '80%',
    height: (Dimensions.get('screen').height / 100) * 10,
    backgroundColor: '#202020',
    position: 'absolute',
    alignSelf: 'center',
    top: '75%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  TabBackground: {
    flex: 1,
    backgroundColor: '#202020',
  },
  evenRowIncome: {
    backgroundColor: '#3490DE50',
  },
  evenRowSpend: {
    backgroundColor: '#DE343450',
  },
  oddRow: {
    backgroundColor: '#202020',
  },
});

export const darkWalletIncome = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '7%',
  },
  balance: {
    color: '#fff',
    marginLeft: '7%',
    fontSize: 32,
    fontWeight: 'bold',
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#000',
  },
});

export const darkBank = StyleSheet.create({
  addButton: {
    width: (Dimensions.get('screen').width / 100) * 15,
    height: (Dimensions.get('screen').width / 100) * 15,
    backgroundColor: '#000',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    position: 'absolute',
    bottom: 15,
    right: 15,
    zIndex: 1,
  },
  ModalView: {
    width: (Dimensions.get('screen').width / 100) * 80,
    height: (Dimensions.get('screen').width / 100) * 120,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ModalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#000',
  },
  listContainer: {
    width: '95%',
    height: (Dimensions.get('screen').width / 100) * 20,
    backgroundColor: '#000',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  bank: {
    color: '#fff',
    fontSize: 16,
  },
  balance: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
