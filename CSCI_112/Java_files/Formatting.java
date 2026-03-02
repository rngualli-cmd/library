import java.text.DecimalFormat;


public class Formatting {

    public static void main(String[] args) {


            // Formatting numeric decimals

        double number = 8623265.248021;

        double number2 = 0.50;

        int number3 = 25;

        System.out.println(number2);


        DecimalFormat deform = new DecimalFormat("#.00");
            /** Do you notice what output DecimalFormat produces?
             text.
            The # is for all values excluding zero
            The 0 is for all values including zero */






		System.out.println(deform.format(number2));
		System.out.println();
        System.out.println("the original value is $" + number);
            // 2 decimal places
        System.out.println("The DecimalFormat value is $" + deform.format(number));

            /** printf 	precision */
            // also 2 decimal places
		System.out.printf("The printf value is $%.2f\n", number);
		System.out.println("hello");
		System.out.println();

        //  %[flags][width][.precision]conversion character
        // s is for String
        // d is for decimal integer (whole numbers)
        // f if for floats or doubles

            // comma separated
        System.out.printf("The value is $%,f\n", number);
            // padding zeros to the end of the value
        System.out.printf("The value is $%.10f\n", number2);
            // pad zero before the value
        System.out.printf("The value is $%010d\n", number3);
            // right justify
        System.out.printf("The value is $%10d\n", number3);
            // left justify
        System.out.printf("The value is $%-10d now\n", number3);



            /** Formatting Strings */
        System.out.println();

        String name1 = "Jennifer";
        String name2 = "Bay";
        String name3 = "Dan";
        String name4 = "Washington";

        System.out.println(name1 + "\t " + name2);
        System.out.println(name3 + "\t " + name4);
        System.out.println();


        System.out.printf("%11s %11s\n", name1, name2);
        System.out.printf("%11s %11s\n", name3, name4);
        System.out.println();

        System.out.printf("%-8s %s\n", name1, name2);
        System.out.printf("%-8s %s\n", name3, name4);
        System.out.println();




            /** you can use the String class to format */
        String output = String.format("%-11s %-11s", name1, name2);
        String output2 = String.format("%-11s %-11s", name3, name4);

            /** You still need a print statement to print */
        System.out.println(output);
        System.out.println(output2);
        System.out.println();

            /** or you can place it directly in a print statement */
        System.out.println(String.format("The value is $%,.2f", number));
        System.out.println("hi"); // How do you get this output on the next line
    }

}
