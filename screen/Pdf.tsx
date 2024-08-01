import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

function PDF() {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const html = `
       <html lang="en">
          <head>
              <style>
                  body {
                      margin: 0%;
                      padding: 0%;
                  }

                  #head {
                      text-align: center;
                  }

                  #head>p {
                      font-size: 20px;
                  }

                  .detail {
                      border: 2px solid black;
                      margin: 5% 20%;
                      padding: 2% 2%;
                      border-radius: 5px;
                  }

                  table {
                      width: 100%;
                      border-collapse: collapse;
                  }

                  table,
                  td,
                  th {
                      border: 2px solid #ddd;
                      text-align: left;
                  }

                  th td {
                      padding: 10px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                  }

                  th {
                      background-color: rgb(168, 196, 255);
                  }

                  #total {
                      margin: 5% 20%;
                      padding: 0% 0%;
                      border: 2px solid black;
                      border-radius: 5px;
                  }

                  .time {
                      text-align: center;
                      font-size: 20px;
                  }
              </style>
          </head>

          <body>
              <div id="head">
                  <h1>July Personal Financial Report</h1>
                  <p>Name : Username</p>
                  <p>Beginning of Month : 1/7/2024</p>
                  <p>End of Month : 31/7/2024</p>
              </div>

              <div class="detail">
                  <table>
                      <tr>
                          <th>Wallet</th>
                          <th>Date</th>
                          <th>Income</th>
                          <th>Spend</th>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>1/7/2024</td>
                          <td>100</td>
                          <td> </td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>5/7/2024</td>
                          <td> </td>
                          <td>200</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>8/7/2024</td>
                          <td>200</td>
                          <td> </td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>15/7/2024</td>
                          <td> </td>
                          <td>500</td>
                      </tr>


                      <tr>
                          <td>Example</td>
                          <td>20/7/2024</td>
                          <td>3000</td>
                          <td> </td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>25/7/2024</td>
                          <td>200</td>
                          <td> </td>
                      </tr>

                      <tr>
                          <td> </td>
                          <td> </td>
                          <td>3500</td>
                          <td>700</td>
                      </tr>
                  </table>
              </div>
              <div class="detail">
                  <table>
                      <tr>
                          <th>E-Wallet</th>
                          <th>Date</th>
                          <th>Income</th>
                          <th>Spend</th>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>1/7/2024</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>


                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>
                  </table>
              </div>

              <div class="detail">
                  <table>
                      <tr>
                          <th>Bank</th>
                          <th>Date</th>
                          <th>Income</th>
                          <th>Spend</th>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>


                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                      <tr>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                          <td>Example</td>
                      </tr>

                  </table>

              </div>

              <div id="total">
                  <table>
                      <tr>
                          <th>Total :</th>
                          <th> </th>
                          <th> 10500 </th>
                          <th> 2100 </th>
                      </tr>
                  </table>
              </div>

              <div class="time">
                  <p>Generation time : <input type="time"></p>
              </div>
          </body>

          </html>
      `;
      const options = {
        html,
        fileName: `invoice_${count}`,
        directory: 'Download',
      };
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', `PDF saved to ${file.filePath}`);
      setCount(count + 1);
      setIsLoading(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return <Text>Generating PDF...</Text>;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => generatePDF()}>
        <Text style={styles.text}>Generate PDF</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  button: {
    backgroundColor: '#6c8ee3',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
});

export default PDF;
