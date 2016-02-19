# meshblu-edison

# dynamic-j5-edison
Dynamically Generate a Johnny-Five plugin through device options.

![alt text](https://raw.githubusercontent.com/octoblu/dynamic-j5-edison/master/imgs/1.png "Logo Title Text 1")

##Setup

1. Make sure your edison has the latest image installed. http://www.intel.com/support/edison/sb/CS-035286.htm
2. Pull up the edison on a serial terminal ( OSX: "screen /dev/tty.usbs[hit tab key] 115200 -L")
3. Type "configure_edison --wifi" and hit enter, follow through to configure wifi.
4. Copy the following commands into your terminal session and hit enter.

```
cd /node_app_slot/ &&
npm install meshblu-edison &&
reboot

```
Please be patient as this may take a few minutes to finish compiling.

7. Go to app.octoblu.com and click on the "Things" page and select Intel Edison from the list.
8. If the Edison connected on the same network as the browser you're using it should show up as an unclaimed device from the drop-down, if not proceed to the next step.
9. If the device doesn't show as discoverable type "cat /node_app_slot/meshblu.json" in a terminal session on the Edison and hit enter to see the device UUID/TOKEN, use this to manually add your device.

## Using with OLED

If you have an OLED connected via i2c to the Edison's i2c bus, either via the Sparkfun i2C breakout, the Intel Arduino breakout, ec cetera you can initialize an OLED from the Edison's device options page. "Things" -> "Connected Things" -> "Your Edison" 

## Using with Sparkfun PWM Breakout

1. Plug your Edison into a console breakout and stack the PWM breakout as well before turning on.
2. Assuming you configured your Edison using the Setup process above, goto the Device Options page for the Edison "Things" -> "Connected Things" -> "Whatever you named your Edison"
3. Click "Add" to add a new component.
4. Select "PCA9685" as the Action and enter the channel you'd like to initialize a servo on.
5. In the Designer, your Edison will now have a drop down with all your available actions.


The below gives a jist of how this is all used.


Add components from the device options page.
Any control based component you add will appear in the message schema by the name you give it.
You can add non-basic IO objects like a servo attached via an i2C interface.
Any sensor components you add will automatically send in a payload with a key based on the name you gave it. 2 messages every second.

Essentially, define your device's abilities and pin configuration in options, and in the designer you can control it using function names from a drop down that make sense to you!


![alt text](https://raw.githubusercontent.com/octoblu/dynamic-j5-edison/master/imgs/4.png "Logo Title Text 1")

![alt text](https://raw.githubusercontent.com/octoblu/dynamic-j5-edison/master/imgs/2.png "Logo Title Text 1")
![alt text](https://raw.githubusercontent.com/octoblu/dynamic-j5-edison/master/imgs/3.png "Logo Title Text 1")
