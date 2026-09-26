//include libraries
#include <DHTesp.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <sys/time.h>

//declare OLED parameter
#define screen_width 128
#define screen_height 64
#define OLED_reset -1
#define screen_address 0x3C

//declare wifi time parameters
const char* ssid = "Wokwi-GUEST";
const char* password = "";
int wifi_channel=6;

//define for healthy condition for medicine
#define TEMP_HIGH 32
#define TEMP_LOW 26
#define HUMIDITY_HIGH 80
#define HUMIDITY_LOW 60

//declare buzzer parameters
int notes[] = {262, 294, 330, 349, 392, 440, 494, 523}; //C,D,E,F,G,A,B,C_H
int n_notes = sizeof(notes) / sizeof(notes[0]);

//declare pins
#define DHT_PIN 14
#define LED1_PIN 5
#define BUZZER_PIN 4
#define PB_cancel 33
#define PB_ok 32
#define PB_up 35
#define PB_down 34

//declare objects
Adafruit_SSD1306 display(screen_width,screen_height,&Wire,OLED_reset);
DHTesp dhtSensor;

//declare global variables

  //###1 related with time
  const tm timeInfo = 
  {
    12, // hour
    0,  // minute
    0   // second
  };

  const char* NTP_SERVER  = "pool.ntp.org";
  String UTC_OFFSET="IST-5:30"; //defaulty set to srilanka
  String utc_offsets[] = {"UTC-12:00","UTC-11:00","UTC-10:00","UTC-09:30","UTC-09:00","UTC-08:00","UTC-07:00", "UTC-06:00","UTC-05:30", "UTC-04:30", "UTC-04:00", "UTC-03:30", "UTC-03:00","UTC-02:00","UTC-01:00", "UTC 00:00","UTC+01:00","UTC+02:00", "UTC+03:00", "UTC+03:30", "UTC+04:00", "UTC+04:30","UTC+05:00","UTC+05:30", "UTC+05:45","UTC+06:00","UTC+06:30","UTC+07:00","UTC+08:00","UTC+08:45", "UTC+09:00","UTC+09:30","UTC+10:00","UTC+10:30","UTC+11:00","UTC+12:00","UTC+12:45","UTC+13:00","UTC+14:00"};
  int num_utc_offsets= sizeof(utc_offsets)/sizeof(utc_offsets[0]);

  int seconds;
  int minutes;
  int hours;

  //###2 related with alarm
  bool alarm_enabled=false;
  int num_alarms=3;
  int alarm_hours[]={0,0,0};
  int alarm_minutes[]={0,0,0};
  bool alarm_triggered[]={false,false,false};

  //###3 related with menue
  int current_mode=0; //store current options in our menue
  String modes[]= {"1 - Set Time","2 - Set Alarm 1","3 - Set Alarm 2","4 - Set Alarm 3","5 - Dissable Alarms"};
  int max_mode= sizeof(modes)/sizeof(modes[0]); //store maximum number of in our menue
  
//declare global functions

//###1 
void print_line(String text,String displayClearStatus="n",int text_size=1,int column=0,int row=0)
{
  if (displayClearStatus=="y")  //n-do not clear display y-clear display
  {
    display.clearDisplay();
  }
  display.setTextSize(text_size); //text_size = 1 --> Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE); //draw in colour text
  display.setCursor(column,row); //where printing start,  row 0-7 , column 0-127
  display.println(text);
  display.display();
}

//###2 
void update_time()
{
  struct tm timeInfo;
  if (!getLocalTime(&timeInfo)) 
  {
    print_line("Failed to obtain time","y");
    return;
  }

  seconds=timeInfo.tm_sec;
  minutes=timeInfo.tm_min;
  hours=timeInfo.tm_hour;
}

//###3 
void print_time_now()
{
  update_time();//###2
  print_line("Time: "+String(hours)+":"+String(minutes)+":"+String(seconds),"y",1,25,30); //###1
}

//###4 
void myTone(int pin, int frequency) 
{
  ledcAttachPin(pin, 0);        // pin, channel
  ledcWriteTone(0, frequency);  // channel, frequency
}

//###5
void myNoTone(int pin) 
{
  ledcDetachPin(pin);
}

//###6
void ring_alarm()
{
  print_line("MEDICINE","y",2,7,10);
  print_line("TIME","n",2,9,35);
  
  bool break_happened=false;

  while (break_happened==false && digitalRead(PB_cancel)==HIGH)
  {
    //ring the buzzer
    for(int i=0;i<n_notes;i++)
    {
      if (digitalRead(PB_cancel)==LOW)
      {
        break_happened=true;
        delay(200);
        break;
      }
      myTone(BUZZER_PIN,notes[i]);//###4
      digitalWrite(LED1_PIN, HIGH);
      delay(200);
      myNoTone(BUZZER_PIN);//###5
      digitalWrite(LED1_PIN, LOW);
      delay(10);
    }
  }
  digitalWrite(LED1_PIN, LOW);
  myNoTone(BUZZER_PIN);//###5
}

//###7
void show_warning(float value, float threshold_low,float threshold_high,int print_row ,String DisplayStatus,String message)
{
  if (value < threshold_low)
  {
    message=message+"LOW";
    print_line(message,DisplayStatus,1,10,print_row);//###1
  }

  if (value > threshold_high)
  {
    message=message+"HIGH";
    print_line(message,DisplayStatus,1,10,print_row);//###1
  }
}

//###8
void check_temp_and_humidity()
{
  TempAndHumidity data = dhtSensor.getTempAndHumidity();
  
  int n=0;

  while(data.temperature<TEMP_LOW || data.temperature>TEMP_HIGH || data.humidity < HUMIDITY_LOW || data.humidity > HUMIDITY_HIGH )
  {
    show_warning(data.temperature, TEMP_LOW, TEMP_HIGH,10 ,"y","TEMPERATURE "); //###7
    show_warning(data.humidity, HUMIDITY_LOW, HUMIDITY_HIGH,30 ,"y","HUMIDITY ");//###7

    n++;
    
    if (n%2==0)
    {
      digitalWrite(LED1_PIN, HIGH);
      myTone(BUZZER_PIN,notes[0]);
      delay(500);
    }

    else
    {
      digitalWrite(LED1_PIN, LOW);
      myNoTone(BUZZER_PIN);
      delay(500);
    }

    data = dhtSensor.getTempAndHumidity();
  }

  digitalWrite(LED1_PIN, LOW);
  myNoTone(BUZZER_PIN);
}

//###9
void update_time_with_check_alarm_and_check_warning()
{
  print_time_now(); //###3

  if (alarm_enabled==true)
  {
    for (int i=0;i<num_alarms;i++)
    {
      if (alarm_triggered[i]==false && alarm_hours[i]==hours && alarm_minutes[i]==minutes)
      {
        ring_alarm(); //###6
        alarm_triggered[i] = true;
      }
    }
  }
  check_temp_and_humidity();//###8
}

//###10
int wait_for_button_press()
{
  int buttons[] = {PB_up, PB_down, PB_ok, PB_cancel};
  int numButtons = sizeof(buttons)/sizeof(buttons[0]);

  while(true)
  {
    for(int i=0; i<numButtons; i++)
    {
      if(digitalRead(buttons[i])==LOW)
      {
        delay(200);
        return buttons[i];
      }
    }
  }
}

//###11
void set_time_unit(int &unit, int max_value, String message)
{

  int temp_unit = unit;

  while (true)
  {
    print_line(message + String(temp_unit), "y");

    int pressed = wait_for_button_press();//###10

    delay(200);

    switch(pressed)
    {
      case PB_up:
        temp_unit = (temp_unit + 1) % max_value;
        break;
      case PB_down:
        temp_unit = (temp_unit - 1 + max_value) % max_value;
        break;
      case PB_ok:
        unit = temp_unit;
        return;
      case PB_cancel:
        return;
    }
  }
}

//###12
void set_alarm(int alarm)
{
  set_time_unit(alarm_hours[alarm], 24, "Enter hour: ");//###11
  set_time_unit(alarm_minutes[alarm], 60, "Enter minute: ");//###11

  print_line("Alarm is set", "y");//###1

  alarm_enabled=true;

  delay(1000);
}

//###13
void disable_alarm()
{
  alarm_enabled = false;
  print_line("Alarms disabled", "y");//###1
  delay(1000);
}

//###14
void set_time_zone()
{
  int index = 8; //default utc_offset
  int index_max=num_utc_offsets;

  while (true)
  {
    print_line("Enter UTC offset  ", "y");//###1
    print_line(utc_offsets[index] , "n",1,0,15);//###1

    int pressed = wait_for_button_press(); //###10

    delay(200);

    if (pressed == PB_up)
      index=(index+1)%index_max;

    else if (pressed == PB_down)
      index=(index- 1+index_max)%index_max;

    else if (pressed == PB_ok)
    {
      UTC_OFFSET = utc_offsets[index];
      configTzTime(UTC_OFFSET.c_str(), NTP_SERVER);
      print_line("Time zone is set", "y",1,10,30);//###1
      delay(1000);
      break;
    }
    else if (pressed == PB_cancel)
      break;
  }
}

//###15
void run_mode(int mode)
{
  switch(mode)
  {
    case 0:
      set_time_zone();//###14
      break;
    case 1:
    case 2:
    case 3:
      set_alarm(mode-1);//###12
      break;
    case 4:
      disable_alarm();//###13
      break;
  }
}

//###16
void go_to_menue()
{
  while(digitalRead(PB_cancel)==HIGH)
  {
    print_line(modes[current_mode],"y",1,0,30); //###1

    int pressed = wait_for_button_press();//###10
    delay(200);

    switch(pressed)
    {
      case PB_up:
        current_mode = (current_mode + 1) % max_mode;
        break;
      case PB_down:
        current_mode = (current_mode - 1 + max_mode) % max_mode;
        break;
      case PB_ok:
        run_mode(current_mode);//###15
        break;
      case PB_cancel:
        return;
    }
  }
}

//main code ###################

void setup() 
{
  //initialize pins mode
  pinMode(DHT_PIN, INPUT);
  pinMode(LED1_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(PB_cancel, INPUT);
  pinMode(PB_ok, INPUT);
  pinMode(PB_up, INPUT);
  pinMode(PB_down, INPUT);

  //ledcSetup() function call before any other LEDC functions
  ledcSetup(0, 2000, 8);  // channel, frequency, resolution

  // Initialize the DHT22 sensor
  dhtSensor.setup(DHT_PIN,DHTesp::DHT22);

  //SSD1306_SWITCHAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC,screen_address))
  {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); //don't proceed loop forever
  }

  //show initial display buffer contents on the screen
  //the library initiallizes this with an adafruit splash screen
  display.display(); 
  delay(1000); //pause for 1 sec

  //clear the buffer
  display.clearDisplay();

  //connect to Wi-Fi
  WiFi.begin(ssid, password, wifi_channel);
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(250);
    print_line("Connecting to WIFI","y",1,0,5);
  }

  print_line("Connected to WIFI","n",1,0,20);
  delay(2000);

  print_line("Updating Time...","n",1,0,35);

  // Set the system time using configTzTime
  configTzTime("IST-5:30", "pool.ntp.org");

  //waiting for time to be set
  while (time(nullptr) < 1510644967) 
  {
    delay(500);
  }

  print_line("Time config updated","n",1,0,50);
  delay(1000);
  display.clearDisplay();
  delay(2000);

  //show welcome message
  print_line("Welcome to Medibox!","y",1,10,30);
  delay(2000);
}

void loop() 
{
  update_time_with_check_alarm_and_check_warning(); //###9
  if (digitalRead(PB_ok)==LOW)
  {
    delay(200);
    go_to_menue(); //###16
  }
}
