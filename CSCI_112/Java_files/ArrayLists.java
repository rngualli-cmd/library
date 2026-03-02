import java.util.ArrayList;

public class ArrayLists {

    public static void main(String[] args) {

        int[] number = {1, 2, 3, 4, 5};
        String[] terms = {"Hi", "What", "Yeah"};

            /** instantiation */
        ArrayList<Integer> numbers = new ArrayList<>();

            /** to get the logical size use the "size" method */
        System.out.println("How many values are in the arraylist " + numbers.size());
        System.out.println();


            /** "add" method */
        numbers.add(5);     /** instead of array[0] = 5; */

        System.out.println("How many values are now in the arraylist " + numbers.size());
        System.out.println();


        numbers.add(1);
        numbers.add(10);
        numbers.add(22);
        numbers.add(7);

            /** The method "get" is just like [] square brackets for arrays */
        System.out.println("The value at index 2 is: " + numbers.get(2));// array[2]
        System.out.println("How many values are now in the arraylist " + numbers.size());
        System.out.println();


            /** the method "remove" */
        numbers.remove(2);
        System.out.println("The value at index 2 after a remove: " + numbers.get(2));
        System.out.println("How many values are now in the arraylist " + numbers.size());
        System.out.println();



            /** adding more values to the arraylist */
        numbers.add(3);
        numbers.add(16);
        numbers.add(27);
        numbers.add(17);
        numbers.add(12);
        numbers.add(109);
        numbers.add(212);
        numbers.add(73);
        System.out.println(numbers.size());

            /** Printing values in an arraylist can be done the same as arrays
             But using the "size" method */
        System.out.println("The values in the arraylist");
        for(int i = 0; i < numbers.size(); i++) {
            System.out.println(numbers.get(i));
            /** Notice how similar this is to an array
             If you replaced the .get(i) with [i] it would be the same as arrays */
        }
        System.out.println();
        System.out.println("How many values are now in the arraylist " + numbers.size());
        System.out.println();


            /** The insert method add(int index, Object)  */
        numbers.add(0, 86);

        System.out.println("The values in the arraylist after the insert");
        for(int i = 0; i < numbers.size(); i++) {
            System.out.println(numbers.get(i));
        }
        System.out.println();
        System.out.println("The arraylist has 1 more cell now " + numbers.size());
        System.out.println();



            /** The replace method set(int index, Object) */
        numbers.set(0, 63);
        System.out.println("The value at the 0 index now " + numbers.get(0));
        System.out.println();
        System.out.println("The number of cells after the set " + numbers.size());
        System.out.println();

            /** printing an ArrayList vs. an array */
        System.out.println(numbers);
            /** prints all the values in the arraylist */
        System.out.println(number);
            /** only prints the memory address/location of the array */
        System.out.println();

            /** Enhanced for loop */
		System.out.println("Using an enhanced for loop to Print the values in the arraylist");

        for(Integer num : numbers) {
                // Integer could be changed to int and it would still work
            System.out.println(num);
                // For regular Objects, the toString would be called.
        }

        System.out.println();
        for(String t : terms){
            System.out.println(t);
        }
        System.out.println();

            // An ArrayList of Regular Objects (Employee's)
        ArrayList<Employee> emps = new ArrayList<>();
            /** instantiating a cell of an arraylist */
        emps.add(new Employee());

        Employee[] people = new Employee[50];
        people[0] = new Employee(); /** very similar to arrays */

        emps.get(0).setName("Bob");
        System.out.println(emps.get(0).getName());
            /** the first get is for the arraylist to know which cell
             the second get is getting the Name */

        emps.get(0).setId("983sjs6");
        emps.add(new Employee("Sue", "9823bsdjhd"));
        emps.add(new Employee("Tyron", "873bdsjde"));
        for(int i = 0; i < emps.size(); i++) {
            System.out.println("The Employee data: " + emps.get(i).getName() +
                    " and id: " + emps.get(i).getId());
        }
        for(Employee e : emps){
            System.out.println("The Employee data: " + e.getName() +
                    " and id: " + e.getId());
        }
    }

}
