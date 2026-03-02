import java.util.Random;

public class RandomNestedLoops {
    public static void main(String[] args) {

        /** Summing values from an array, ArrayList, or user input. */
        // example using an array
        int[] numbers = { 1, 2, 3, 5, 6, 9, 7 };

        int sum = 0; // notice I initialize the variable here before the loop
        for(int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
            // or: sum = sum + numbers[i];
        }
        System.out.println("the sum is " + sum);
        /** to get the average simply divide by the array length */
        System.out.println("the average is " + sum/numbers.length);


        /** variables declared here toward the top of the main method
         can be used in any following/below loops  */

        // instantiation
        Random rand = new Random();

        int n = rand.nextInt();
        /** without a number in the parenthesis, nextInt would
         create a random number between -2,147,483,648 and 2,147,483,647
         */



        int num1 = rand.nextInt(10);
        // placing 10 in the parenthesis produces numbers from 0 to 9



        /** What if I wanted values from 1 to 10 */





        /** That's right add 1 to the number after it is generated
         from 0 to 9 */
        int num2 = rand.nextInt(10) + 1;



        // If I wanted values from 5 to 15


        int num3 = rand.nextInt(15 - 5 + 1) + 5;



        /** If I wanted 125 to 400 */
        int num4 = rand.nextInt(400 - 125 + 1) + 125;



        int num = 0;
        while(num < 5){
            System.out.println(num);
            num++;
            System.out.println("\t" + num + " num increased");
        }
        System.out.println(num);

                /** Nested loops */

        for(int outer = 0; outer < 5; outer++) { // this loop counts from zero to 5
            /**
			  Variables declared here can be used in the following inner loop.
			  Any print statement here, happens before anything code in the
			 	    following inner loop happens */
            for(int inner = 3; inner > 0; inner--) { // this loop counts from 3 down to 0
                /**  Any statement in here happens for every iteration of the inner loop
                  Any variable declared here can only be used here */
            }
            /** Any statement here are not connected to the inner loop, it is part of
             the outer loop. */
        }

            /** example */
        for(int i = 4; i > 0; i--) {
            System.out.print("hi ");
            for(int k = 0; k < i; k++) { // i will be 4 3 2 1
                System.out.print("there ");
            }
            System.out.println("end");
        }
        System.out.println();
        



    }
}
