import java.util.Scanner;

public class WrapperClasses {

    public static void main(String[] args) {
        
        String nums = "7625";
        int numb = Integer.parseInt(nums);
            /** This converts the String of numbers to an int that can
             be used for calculations */

        int num = 786234;

            /** Using the Integer class toString method
              to convert an integer to a String */
        String number1 = Integer.toString(num);

            /** or the String class valueOf method */
        String number2 = String.valueOf(num);


            /** Character class example */

        Scanner keyboard = new Scanner(System.in);

        boolean good = false;
            /** create a variable to know whether to loop or not */

        int number = 0; /** will store the number */

        while(!good) {  /** loop as long as good is false
                         and the input is incorrect */
            System.out.println("Enter 5 numbers without a decimal");
                /** I'm getting the user input as a String */
            String input = keyboard.nextLine();
                /** I will then test the users input
                 First, test the length of the input */
            if(input.length() != 5) {
                System.out.println("Invalid input length");
                System.out.println();
            }
            else {
                int index = 0;	/** to keep track of the index */
                boolean valid = true;
                    /** next test the input for all numbers */
                while(valid && index < input.length()) {
                    if(!Character.isDigit(input.charAt(index))) {
                        valid = false;
                    }
                    index++;
                }
                if(valid) {
                        /** if the correct length and all numbers
                         convert the String to an int */
                    number = Integer.parseInt(input);
                        /** assign good true to stop the outer loop */
                    good = true;
                }
                else {
                    System.out.println("Invalid, input was not all numbers");
                    System.out.println();
                }
            }
        }
        System.out.println();
        System.out.printf("Math equation: %d + 1000 = %d\n", number, number + 1000);


            // autoboxing and unboxing
        Integer myInt = 5;  // autoboxing
        int primNum;
        primNum = myInt;    // unboxing

        
            /** Scanner Issue with user input */
            
        System.out.println("Enter a whole number");
        int testNumber = keyboard.nextInt();
        System.out.println("The number the user entered " + testNumber);
        System.out.println();

        System.out.println("Enter a word");
        String word = keyboard.nextLine();
        System.out.println("The word the user entered " + word);
        System.out.println();






    }

}
