
public class Person {

    /**
     A Class represents any Object (thing - real or not) imaginable.

     examples: Puppy, Car, House, Chair, Course, Student, SpaceShip,
        Alien, etc.

     When you write a Class, you must determine the class attributes
        (also known as class variables, fields, or global variables)
        that specifies what constitutes or makes up that object.

     For example:
     a Person - what makes up a person?
     - a name
     - an age
     - maybe a hometown
     - Depending on the country: a SS number?
     - height
     - weight
     - hair color
     the list goes on and there could even be an array or arrayList
        (we'll cover these later)

     Once you know the class attributes, you should declare them at the
        top of the class after the class header and make them private,
        since you don't want outside classes accessing the attributes
        directly. This includes arrays or arrayLists classes.

     You generally don't initialize the attributes at the top of the class. That way you can reuse the class multiple times like a blueprint for a house.

     These attributes are needed to instantiate one Person object in another class like the Driver or in an intermediate class (which is an Object class that has another Object class as an attribute).
     So how do we give values to the attributes to store?



     class attributes, declared only
     */
    private String name;
    private int age;

    /**
     Static
        Using the key word static with class attributes is great for CONSTANT
            variables (storing values that never or rarely change - like tax
            rates or years), but not for normal variables which store values
            that change often.
        The keyword static creates one and only one memory location for the
            variable or method (a reason it is used for the main method since
            there should only be one)
        A static class member (attribute) belongs to the class, not objects
            instantiated from the class. So, there will only be one total,
            not one for each instantiated object.
        By using static every instance of the MotorCycle class will use one
            make variable memory location, so all of them have the same make
     */
//    private static String name;

    /**
     The 4 primary methods of an Object Class
        Constructor - builds the memory locations for the Class and attributes
        Accessor - getter - returns the value of a single attribute
        Mutator - setter - changes the value of a single attribute
        toString - returns a String that represents the state of the object.
            The String should be appropriate for displaying the information
            of a Class with labels to the screen for a user.

     Rules for Constructors

     1. The name of a Constructor MUST match the name of the class
     2. a Constructor NEVER has a return type


     You should generally have 2 Constructors (1 No-Arg and 1 parameterized),
        but can have more, as many as needed by the class or design of the
        program.

     No-Arg parameter list - assigns the attributes null or non-values
     */
    public Person(){
        name = "";
        age = 0;
    }

    /**
     parameterized parameter list - assigns attributes values that have been
     passed to the method.
     */
    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }

    /**
     Constructors are also an example of method Overloading as both methods
     have the same name - Person - but the parameter lists are different,
     giving each method a different signature - a method signature
     consists of the method name and data types in the parameter list so,
     Person() is different from Person(String, int)

     parameterized parameter list
     with a different example of using the "this" keyword
     */
    public Person(String name){
        this(name, 0);
    }
        /** you won't see code like this often, but it is allowed.
         Used here, "this" simply calls the Constructor that matches
         the arguments being passed (String, int). It is handy when you
         will only have a person's name for the instantiation.
         */


    /**
     Rules for Mutators (setters)

     1. they do not return any value
     2. have a single parameter and work with only 1 attribute
     3. the method name begins with set
     4. Assigns the value passed to the method to the attribute associated with the method name.
     */
    public void setName(String Name){
        name = Name;
    }

    public void setAge(int Age){
        age = Age;
    }


    /**
     Rules for Accessors (getters)

     1. they always return the value stored by the attribute associated with the name of the method - doesn't normally have a parameter but there are circumstances when one is needed (usually for Junit testing only).
     2. the method name starts with get
     */

    public String getName(){
        return name;
    }

    public int getAge(){
        return age;
    }

    /**
     Rules for toString

     a toString method returns a String that represents the state of the Object
        (that is the values stored by the class - the attributes - and also
        including identifying labels to identify the attributes)

     You can create and return a String in several ways
     */

    public String toString(){
        String s = "Name: " + name + " age: " + age;
        return s;
    }
}
