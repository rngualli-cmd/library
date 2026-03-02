public class RevisitArrays {
    public static void main(String[] args) {

        // an integer array named number with a physical length of 100
        int[] number = new int[100];
        // You MUST specify the length of the array in the instantiation!

        // a String array literal with 3 hard coded values
        String[] terms = {"uhm", "yeah", "time"};
        // The length is specified by only having 3 values

        // a Student array named people with a physical length of 50
        Student[] people = new Student[50];
        System.out.println(people[0].getName()); // This statement causes an error
            /** comment the above statement to remove the error

                The error is caused because the first cell (zero) hasn't been
                instantiated.
             */
        people[0] = new Student();
            /** so you must instantiate each cell individually or use a loop
             to code less */
        for(int i = 0; i < people.length; i++) {
            people[i] = new Student();
        }

    }
}
