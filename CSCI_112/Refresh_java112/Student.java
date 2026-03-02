public class Student {

    /**
     Chapter 6

     I divide classes into a couple of different categories.
     A Driver – has a main method and is the start class for a project.
     A Regular Object class – represents an Object in the world (Person,
        Student, Car, etc.)
     An Intermediate Object class – these classes also represent an Object
       in the world, but instead of simply containing int’s or String, they
       generally also have a regular Object Class as an attribute (we will
       go over this more later). Intermediate Object classes are found in
       between the Driver and Regular Object classes, hence the intermediate
       naming.

     I use these terms to make it easier to distinguish between classes
       I’m talking about in lecture, assignments, and exams.

     All Regular Object classes contain the same parts:

     Class attributes - variables
     Constructors - methods
     Mutators (setters) - methods
     Accessors (getters) - methods
     toString – method

     Intermediate Object Classes differ in that they also contain other
       types of methods besides the ones listed above (print, calculate,
       sort, etc.) depending on what is needed for the class, but they
       will have class attributes.

     Attributes:
     class attributes are generally declared only at the top of a class
       and should always be private (unless it is a CONSTANT).
     They are not usually initialized (assigned values) but only declared
       so the class can be reused many times.

     */
    private String name; // class attribute


    /**
     Constructors:
        You should generally have 2 constructors (No-Arg and Parameterized),
          but you can have as many as the class needs.

     •	No-Arg parameter list constructor – is a constructor that does not
        receive any arguments. It simply initializes the class attributes
        with zero’s, empty Strings, or instantiates arrays with a length
        or other data structures when the Object is constructed
        (instantiated, created, etc.). If this method is used, you would
        then use the Mutators (described below) to assign values to the
        class attributes later.
     */
    public Student() {
        name = "";
    }

    /**
     •	Parameterized constructor – contains declared variables in the
        parameter list (parenthesis). This method receives arguments to
        assign to the class attributes when the Object is constructed
        (instantiated, created, etc.). Using this method does not require
        the use of Mutators to assign values later.
     */
    public Student(String Name) {
        name = Name;
    }

    /**
     Mutators: (setter)
        Generally, you have 1 mutator per class attribute (except for data
          structures, to assign values to a data structure you would
          typically use an add method which does a little more than a
          Mutator).
        A Mutator allows the value stored by an attribute to be changed
          (mutated). Set the attribute with a new value, hence setter.
     */
    public void setName(String Name) {
        name = Name;
    }

    /**
     Accessors: (getter)
        Like a Mutator in that you generally have 1 accessor per class
          attribute (they can be used with data structures).
        An accessor simply returns the value stored by a class attribute,
          hence getter.

     */
    public String getName() {
        return name;
    }

    /**
     toString:
        chapter 8 – this method returns a String that represents the
          state of the Object (the values stored by the Object).
          You generally use formatting and have appropriate labels for
          the values.
     An appropriate label would be placing the word age before someone’s
        age rather than just printing a number without something to let a
        user know what the number is for. 

     */
    public String toString(){
        return "Student's name: " + name;
    }
}
