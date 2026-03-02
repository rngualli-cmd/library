import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PersonTest {

    @Test
    void noArg() {
        Person per = new Person();
        assertNotNull(per);
    }

    @Test
    void parameterized() {
        Person per = new Person("Bob", 21);
        assertAll(
                () -> assertEquals("Bob", per.getName()),
                () -> assertEquals(21, per.getAge())
        );
    }

    @Test
    void setName() {
        Person per = new Person();
        per.setName("Bob");
        assertTrue(per.getName().equals("Bob"));
    }

    @Test
    void setAge() {
        Person per = new Person();
        per.setAge(21);
        assertEquals(21, per.getAge());
    }

    @Test
    void testToString() {
        Person per = new Person("Bob", 21);
        assertEquals("Name: Bob        age: 21", per.toString());
    }
}