import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GroupTest {

    @Test
    void noArgConstructor() {
        Group gro = new Group();
        assertNotNull(gro);
    }

    @Test
    void paramConstructor() {
        Group gro = new Group("ACM");
        assertAll(
                () -> assertEquals("ACM", gro.getGroupName()),
                () -> assertEquals(0, gro.getLogLength()),
                () -> assertNotNull(gro.getArray())
        );
    }

    @Test
    void setGroupName() {
        Group grou = new Group();
        grou.setGroupName("ACM");
        assertEquals("ACM", grou.getGroupName());
    }

    @Test
    void addPersonToArray() {
        Group groot = new Group();
        groot.addPersonToArray("Bob", 18);
        groot.addPersonToArray("Sue", 10);
        assertAll(
                () -> assertEquals(2, groot.getLogLength()),
                () -> assertNotNull(groot.getCellFromArray(1)),
                () -> assertEquals("Bob", groot.getNameFromCell(0))
        );
    }

    @Test
    void calcAvgAge() {
        Group gr = new Group();
        gr.addPersonToArray("", 10);
        gr.addPersonToArray("", 20);
        assertEquals(15, gr.calcAvgAge());
    }
}









