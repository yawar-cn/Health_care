package com.healthcare.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ConsultationTest extends BaseTest {

    @Test
    void testBookConsultation() throws InterruptedException {
        // Login first
        driver.get("http://localhost:5173/login");

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[type='email']")
        )).sendKeys("user@example.com");
        Thread.sleep(800);
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[type='password']")
        )).sendKeys("u@123");
        Thread.sleep(800);
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(),'Login')]")
        )).click();
        Thread.sleep(800);
        wait.until(ExpectedConditions.urlContains("dashboard"));
        Thread.sleep(800);
        // Navigate to consultation page
        driver.findElement(By.linkText("Book Consultation")).click();
        Thread.sleep(800);
        wait.until(ExpectedConditions.urlContains("/appointments/book"));
        Thread.sleep(800);
        By specializationSelect = By.xpath(
                "//main//label[contains(normalize-space(),'Specialization')]/following-sibling::select"
        );
        wait.until(ExpectedConditions.visibilityOfElementLocated(specializationSelect));
        wait.until((webDriver) -> new Select(webDriver.findElement(specializationSelect))
                .getOptions().size() > 1);
        Thread.sleep(800);
        By selectDoctorButton = By.xpath("//main//button[normalize-space()='Select Doctor']");
        By firstSelectDoctorButton = By.xpath("(//main//button[normalize-space()='Select Doctor'])[1]");
        By noDoctorsMessage = By.xpath(
                "//main//*[contains(text(),'No doctors available for this specialization.')]"
        );
        By loadingDoctorsMessage = By.xpath("//main//*[contains(text(),'Loading doctors...')]");

        boolean doctorSelected = false;
        int totalSpecializations = new Select(driver.findElement(specializationSelect))
                .getOptions()
                .size();
        for (int i = 1; i < totalSpecializations; i++) {
            new Select(driver.findElement(specializationSelect)).selectByIndex(i);

            wait.until((webDriver) -> {
                boolean loadingDoctors = !webDriver.findElements(loadingDoctorsMessage).isEmpty();
                boolean hasDoctor = !webDriver.findElements(selectDoctorButton).isEmpty();
                boolean noDoctors = !webDriver.findElements(noDoctorsMessage).isEmpty();
                return !loadingDoctors && (hasDoctor || noDoctors);
            });
            Thread.sleep(800);
            if (!driver.findElements(selectDoctorButton).isEmpty()) {
                wait.until(ExpectedConditions.elementToBeClickable(firstSelectDoctorButton)).click();
                doctorSelected = true;
                break;
            }
        }

        assertTrue(doctorSelected, "No available doctors found for any specialization.");

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("main textarea[placeholder='Describe your symptoms...']")
        )).sendKeys("Fever and headache");
        Thread.sleep(800);
        driver.findElement(By.xpath("//main//button[normalize-space()='Submit Request']"))
                .click();
        Thread.sleep(800);
        wait.until(ExpectedConditions.urlContains("/patient/appointments"));
        Thread.sleep(800);
        assertTrue(driver.getCurrentUrl().contains("/patient/appointments"));
    }
}
