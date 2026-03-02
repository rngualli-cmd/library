import java.util.Random;
import java.util.Scanner;

public class Java1Refresher {

    public static void main(String[] args) {

        // primitive examples
        int time = 10; // initialized variable
        double sec;     // declared variable

        // Object example
        Scanner keyboard = new Scanner(System.in); // an instantiation


        // declared variable examples
        int value;
        Scanner scan;


            // initialization examples
        int number = 28; // equal sign is known as the assignment operator
        String name = "Bob";

        System.out.println(); // prints a blank line

            // instantiation examples
        Random person = new Random();

        String word = new String("Hi");


        // Decision structure for just one condition - a true
        if (number > 50) {
            System.out.println("it prints");
            // the above print only happens IF number has a value over 50
            // if number is not greater than 50 the print is skipped.
        }

            // 2 conditions: looking for a true or false
		if (number > 50) {
            // any code here would only happen if number is greater than 50
		} // if false run the else below
		else {
            System.out.println("Nope");
            // only if number isn't over 50 will this print happen
            // without the else the print would happen regardless of the if
        }

            /**
             2 conditions (or more): looking for true statements only.
                And only the first true condition reached will happen.
                All three below could be true, but only the first one happens.
            */
		if (number > 50) {
            // if true run whatever code is here and skip all the else if's below
            // if false skip to the else if below
		}
		else if (number > 100) {
            // if the if is false check this Boolean expression
            // if true run whatever code is here and skip the else if below.
            // if false skip to the else if below
		}
		else if (number > 150) {
            // if the first else if is false check this Boolean expression
            // if true run whatever code is here
            // if false skip to the next or out of the conditional
        }
        //etc..

            /**
              multiple conditions of true and only 1 false
             */

		if (number > 50) {
            // if true run whatever code is here and skip the else if and else
            // if false skip to the else if below
		}
		else if (number > 100) {
            // if the if is false check this Boolean expression
            // if true run whatever code is here and skip the else below
            // if false skip to the else below
		}
		else {
            System.out.println("nope"); // only happens if the statements above are false
        }


            // while loop
        boolean found = false; // loop control variable
        while(!found) {  // evaluate the variable
            /**
                The ! (the not logical operator) shown above before the
                    variable - found - is used to flip the variables value for
                    the loop only, it doesn't affect the variables value in memory.

                if what is being looked for is found, change - found - to true
             */
            found = true;  // update
            /** without the above statement that updates the variable,
                   the loop will never end, creating an infinite loop.
             */
        }


            /**  do while - notice the while is after the closing curly
                        brace, and it has a semicolon at the end of the
                        statement.
             */

        do {
            /**
              again, if what is being looked for is found,
                    assign the variable found the value true
             */
            found = true;   // update
        } while(!found);    // evaluate at the end



            /** for loop
           initialize; evaluate; update       all in the same line*/
        for(int i = 0; i < 5; i++){

        }




            // An example of a method call to a method in this class
        int num = sumValues();

           // an example passing three arguments to the method printInfo
        printInfo(50, "Bob", "Oxford");


    }

        /**
         Example of a No-Arg method
         */
    private static int sumValues() {
        int[] nums = {2, 4, 6, 8, 10};
        int sum = 0;
        for(int i = 0; i < nums.length; i++){
            sum += nums[i];
        }
        return sum;
    }

       // parameterized method example
    private static void printInfo(int i, String name, String town) {

    }


}
