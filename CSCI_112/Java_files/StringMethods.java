
public class StringMethods {
    public static void main(String[] args) {

        String words = "Take the high road";

            /** the replace method  */

        String newWords = words.replace('a', 'o');
		System.out.println(words);
		System.out.println(newWords);
		System.out.println();

            /** The trim method */

        String word1 = "    Hello ";
        String word2 = " World";
		System.out.println(word1 + word2);
		System.out.println(word1.trim() + word2);
        System.out.println(word1);
		System.out.println(words.trim()); // trim does nothing if there aren't spaces
		System.out.println();





        String fruit = "peach raspberry strawberry vanilla";
            /** In the above String: the fruits are the tokens and the spaces
                 are the delimiters.
             The following 15 lines of code that separate the words
                can be shortened to one line by using the String split method
                shown on line 67 */
        String[] examp = new String[5];
        int index = 0;
        String fruitWord = "";
        for(int i = 0; i < fruit.length(); i++){
            if(fruit.charAt(i) == ' '){
                examp[index] = fruitWord;
                fruitWord = "";
                index++;
            }
            else {
                fruitWord += fruit.charAt(i);
            }
            if(i == fruit.length()-1){
                examp[index] = fruitWord;
                index++;
            }
        }
            /** printing the separated fruits */
        for(int i = 0; i < examp.length; i++){
            System.out.println(examp[i]);
        }
        System.out.println();

        String[] fruits = fruit.split(" ");

		System.out.println(fruits.length);

		for(int i = 0; i < fruits.length; i++) {
			System.out.println(fruits[i]);
		}
		System.out.println();

            /** delimiters can be more than one character */
        String count = "one and two and three and four";
        String[] counts = count.split(" and ");
            /** notice the delimiter is in order of what needs to be removed */

		for(int i = 0; i < counts.length; i++) {
			System.out.println(counts[i]);
		}
		System.out.println();

            /** be sure the delimiter is spelled correctly, if I add an extra space
             nothing will be split. */

            /** multiple delimiters */

        String email = " jcarlis1@olemiss.edu-hey%there";
        String[] parts = email.trim().split("[@.%-]");


		for(int i = 0; i < parts.length; i++) {
			System.out.println(parts[i]);
		}
        System.out.println();
		System.out.println("The username is: " + parts[0]);
		System.out.println();

//        Scanner keyboard = new Scanner(System.in);
//        System.out.println("Enter your full name");
//        String name = keyboard.nextLine();
//        String letters = "";
//        String[] nameSplit = name.split(" ");
//        for(int i = 0; i < nameSplit.length; i++){
//            letters += nameSplit[i].charAt(0);
//        }
//        System.out.println("Your initials are: " + letters);
//        System.out.println();




    }
}
